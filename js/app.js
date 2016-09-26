/* eslint-disable */
"use strict";
const WU_KEY = "8e038883d8fbbe15";
const PROJECT_NAME = "FCC Weather App";

(function()
  {
    //
    let elButton = document.getElementById("button-ziporcity");
    elButton.addEventListener("click", userEnteredLocation, false);
    /* ******************************************* */
    let elInput = document.getElementById("input-ziporcity");
    elInput.addEventListener("keydown", function (event) {
      if (event.defaultPrevented) {
        // do nothing
      } else {
        // alert(event.key);
        if (event.key === "Enter") {
          console.log("Enter pressed");
          userEnteredLocation();
          event.preventDefault();
        } else {
          return;
        }
      }
    }, true)
    /* ****************************************** */
    elButton = document.getElementById("button-fahrenheit");
    elButton.addEventListener("click", function(){changeNumScale("button-fahrenheit")}, false);
    elButton = document.getElementById("button-celsius");
    elButton.addEventListener("click", function(){changeNumScale("button-celsius")}, false);
    /* ****************************************** */
    toggleNumScaleButtons();
    populatePage();
  }
)();

function setCity(city) {
  if (!city == "") {
    sessionStorage.setItem("currentCity", city);
  } else {
    alert("City is not set");
  }
  console.log("setCity().currentCity=" + city);
}

function getCity() {
  console.log("getCity()");
  var city = sessionStorage.getItem("currentCity");
  return city;
}

function setNumScale(numScale) {
  if (!numScale == "") {
    sessionStorage.setItem("numScale", numScale);
  } else {
    alert("numScale is not set");
  }
  console.log("setNumScale.numScale=" + numScale);
}

function getNumScale() {
  console.log("getNumScale()");
  var tmp = sessionStorage.getItem("numScale");
  return tmp;
}

function changeNumScale(btnName) {
  console.log("changeNumScale()");
  var tmp = "";
  switch (btnName) {
    case "button-celsius":
      tmp = "c";
      break;
    case "button-fahrenheit":
    default:
      tmp = "f";
  }
  setNumScale(tmp);
  toggleNumScaleButtons();
  populatePage();
  // doesn't work yet
  $('.pnl-main').fadeTo(1000, 0.5, function() { $('.pnl-main').fadeTo(800, 1); });
}

function toggleNumScaleButtons() {
  var tmp = getNumScale();
  if (tmp === "") {
    tmp = "f";
    setNumScale(tmp);
  }
  if (tmp == "c") {
    $("#button-celsius").removeClass("button-inactive");
    $("#button-celsius").addClass("button-active");
    $("#button-fahrenheit").removeClass("button-active");
    $("#button-fahrenheit").addClass("button-inactive");
  } else {
    $("#button-celsius").removeClass("button-active");
    $("#button-celsius").addClass("button-inactive");
    $("#button-fahrenheit").removeClass("button-inactive");
    $("#button-fahrenheit").addClass("button-active");
  }
}

function userEnteredLocation() {
  console.log("userEnteredLocation");
  let city = getInputCity();
  if (city === "") {
    alert("Please enter a city");
    return;
  }
  populatePage(city);
}

function getInputCity() {
  let city = "";
  console.log("getInputCity");
  city = $("#input-ziporcity").val();
  console.log("city=" + city);
  setCity(city);
}

function populatePage() {
  // So this is funcky to have 2 different ways of making a getJSON call.
  // However, the ipinfo.io call mysteriously stopped working with
  // getJSON but works with $.getJSON so I'm doing it that way. I could do
  // both with $.JSON but WeatherUnderground recommends .ajax method and
  // ipinfo.ip doesn't need ajax because it only runs on page load
  console.log("populatePage")

  var localCity = getCity();
  console.log("> localCity=" + localCity);
  if (localCity) {
    let weatherURL = buildWeatherURL(localCity);
    console.log(weatherURL);
    getJSON(weatherURL, function(data) {
      makePageElements(data);
    });
  } else {
    $.getJSON("http://ipinfo.io", function(data){
      var city = data.city;
      if (city) {
        setCity(city);
      } else {
        alert("Could not get city via ipinfo.io");
      }
    })
  }
}

function buildWeatherURL(city) {
  console.log("buildWeatherURL");
  console.log("> city=" + city);
  let url = "";
  let state = "CA";
  // alert(location);
  // GET http://autocomplete.wunderground.com/aq?query=San%20F&c=US
  // Done as below it will search for the city
  // http://api.wunderground.com/api/8e038883d8fbbe15/conditions/q/hicksville.json
  url = "http://api.wunderground.com/api/8e038883d8fbbe15";
  url += "/conditions/q/"
  url += state;
  url += "/" + city + ".json";
  console.log("> url=" + url);
  return url;
}

function getJSON(url, callback) {
  console.log("getWeather");
  $.ajax({
    dataType: "jsonp",
    url: url,
    jsonCallback: "jsonp",
    // data: { lat: coords[0], lon: coords[1] },
    cache: false,
  })
  .done(function(json) {
    callback(json);
  })
  .fail(function(xhr, status, errorThrown) {
    alert("Sorry, there was a problem!");
    console.log("error: " + errorThrown);
    console.log("status: " + status);
    console.dir(xhr);
  })
  .always(function(xhr, status) {
    // alert("the request is complete!");
  });
}

function makePageElements(data) {
  console.log("makePageElements");
  var location = data.current_observation.display_location.full;
  // do I need to get or set city here?
  appendToElement("title", location);

  var observationTime = data.current_observation.observation_time;
  var dateTime = observationTime.slice(16);
  appendToElement("sub-title", dateTime);

  var temp_f = data.current_observation.temp_f;
  var temp_c = data.current_observation.temp_c;
  if (getNumScale() ==="f") {
    appendToElement("temperature", temp_f);
  } else {
    appendToElement("temperature", temp_c);
  }

  var weather = data.current_observation.weather; // cloudy, sunny, etc
  setBackground(weather);
  appendToElement("condition", weather);

  var feelsLike_f = "feels like " + data.current_observation.feelslike_f;
  var feelsLike_c = "feels like " + data.current_observation.feelslike_c;
  if (getNumScale() ==="f") {
    appendToElement("feels-like", feelsLike_f);
  } else {
    appendToElement("feels-like", feelsLike_c);
  }

  /* They don't provide high and low :(
     var highTemp = data.current_observation.
  */
  var uv = "UV Index " + data.current_observation.UV + " of 10";
  appendToElement("uv-index", uv);

  var iconURL = data.current_observation.icon_url;
  appendImage("condition-icon", iconURL);

  clearTable("tbl-details");
  // Start adding to table
  var windMPH = data.current_observation.wind_mph;
  var windDirection = data.current_observation.wind_dir;
  var windGustMPH = data.current_observation.wind_gust_mph;
  var windStr = windDirection + " " + windMPH + "mph, gusts to ";
  windStr += windGustMPH + " mph";
  appendTableRow("tbl-details", "Wind");
  appendTableRow("tbl-details", windStr);

  var humidity = data.current_observation.relative_humidity;
  appendTableRow("tbl-details", "Humidity");
  appendTableRow("tbl-details", humidity);

  var dewPoint_f = data.current_observation.dewpoint_f;
  var dewPoint_c = data.current_observation.dewpoint_c;
  appendTableRow("tbl-details", "Dew Point");
  appendTableRow("tbl-details", dewPoint_f);

  var pressure_mb = data.current_observation.pressure_mb;
  var pressure_in = data.current_observation.pressure_in;
  var pressureTrend = data.current_observation.pressure_trend;
  appendTableRow("tbl-details", "Pressure");
  var pressure = dewPoint_f;
  pressure += "<span class='glyphicon glyphicon-arrow-up' aria-hidden='true'></span>"
  appendTableRow("tbl-details", pressure);
}

function appendToElement(parentId, text) {
  var ele = document.getElementById(parentId);
  // remove and existing content
  while (ele.firstChild) {
    ele.removeChild(ele.firstChild);
  }
  // Add text node
  var txt = document.createTextNode(text);
  ele.appendChild(txt);
}

function makeElement(parentId, elementType, text) {
  var ele = document.createElement(elementType);
  // Add new text node
  var txt = document.createTextNode(text);
  ele.appendChild(txt);
  document.getElementById(parentId).appendChild(ele);
}

function clearTable(tableId) {
  var tbl = document.getElementById(tableId);
  while (tbl.firstChild) {
    tbl.removeChild(tbl.firstChild);
  }
}

function appendTableRow(parentId, text) {
  var tbl = document.getElementById(parentId);
  var row = tbl.insertRow();
  var cell = row.insertCell();
  cell.innerHTML = text;
}

function appendImage(parentID, src) {
  var ele = document.getElementById(parentID);
  while (ele.firstChild) {
    ele.removeChild(ele.firstChild);
  }
  var img = document.createElement("img");
  img.src = src;
  ele.appendChild(img);
}

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  // Replace 'my_data' with the path to your file
  xobj.open("GET", "sample.json", true);
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT
      // return a value but // simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function setBackground(val) {
  let ret = "";
  let color = "";

  switch (val.toLowerCase()) {
    case "clear":
    case "sunny":
      //ret = clearSkyPic;
      ret = "http://klequis.com/images/weather/clearsky01.jpg";
      color = "black";
      break;
    case "mostly sunny":
      //ret = mostlySunnyPic;
      ret = "http://klequis.com/images/weather/mostly.sunny.png";
      color = "white";
      break;
    case "cloudy":
      //ret = cloudyPic;
      ret = "http://klequis.com/images/weather/cloudy.png";
      color = "white";
      break;
    case "fog":
      //ret = fogPic;
      ret = "http://klequis.com/images/weather/fog.png";
      break;
    case "mostly cloudy":
      //ret = mostlyCloudyPic;
      ret = "http://klequis.com/images/weather/mostly.cloudy.png";
      break;
    case "rain":
      //ret = rainPic;
      ret = "http://klequis.com/images/weather/rain.jpg";
      color = "white";
      break;
    case "thunderstorms":
      //ret = thunderstormsPic;
      ret = "http://klequis.com/images/weather/thunderstorms.png";
      color = "white";
      break;
    case "partly cloudy":
    case "partly sunny":
    default:
      color = "white";
      //ret = unknownPic;
      ret = "http://klequis.com/images/weather/unknown.png";
  }

  // $("#root").css("color:white");
  $('.main').css("background-image", "url(" + ret + ")");
  $('.main').css("color", color);
  // $('.main').css("background-image", "url(" + getBackgroundImage(weather) + ")");
  // return ret;
}
