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
    $.getJSON('http://ipinfo.io', function(data){
      console.log("city=" + data.city);
      let url = populatePage(data.city);
      useAPI(url);
    })
    /* ****************************************** */
  }
)();

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
  return city;
}

function populatePage(city) {
  console.log("populatePage")
  let url = buildURL(city);
  console.log(url);
  getWeather(url, function(data) {
    makePageElements(data);
  });
}

function buildURL(city) {
  console.log("buildURL");
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
  return url;
}

function getWeather(url, callback) {
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
  appendToElement("title", location);

  // Thu 15 Sep 2016 04:17:13 PM PDT GMT-7:00 DST
  // 1473981433
  var epoch = data.current_observation.local_epoch;
  var dateTime = moment.unix(epoch).format("MMM D, YYYY h:mm a");
  appendToElement("sub-title", dateTime);

  var temp_f = data.current_observation.temp_f;
  var temp_c = data.current_observation.temp_c;
  appendToElement("temperature", temp_f);

  var weather = data.current_observation.weather; // cloudy, sunny, etc
  setBackground(weather);
  appendToElement("condition", weather);

  var feelsLike_f = "feels like " + data.current_observation.feelslike_f;
  var feelsLike_c = "feels like " + data.current_observation.feelslike_c;
  appendToElement("feels-like", feelsLike_f);

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
  // appendTableRow("tbl-details", dewPoint_f + " " + pressureTrend);
  // <i class="fa fa-long-arrow-down" aria-hidden="true"></i>
  var pressure = dewPoint_f;
  // pressure +=  "<i class='fa fa-long-arrow-up' aria-hidden='true'>a</i>";
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
  // document.write(pstart + text + pend);
  // document.write(parentId + ", " + elementType + ", " + text);
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
      ret = clearSkyPic;
      color = "black";
      break;
    case "mostly sunny":
      ret = mostlySunnyPic;
      color = "white";
      break;
    case "cloudy":
      ret = cloudyPic;
      color = "white";
      break;
    case "fog":
      ret = fogPic;
      break;
    case "mostly cloudy":
      ret = mostlyCloudyPic;
      break;
    case "rain":
      ret = rainPic;
      color = "white";
      break;
    case "thunderstorms":
      ret = thunderstormsPic;
      color = "white";
      break;
    case "partly cloudy":
    case "partly sunny":
    default:
      color = "white";
      ret = unknownPic;
  }

  // $("#root").css("color:white");
  $('.main').css("background-image", "url(" + ret + ")");
  $('.main').css("color", color);
  // $('.main').css("background-image", "url(" + getBackgroundImage(weather) + ")");
  // return ret;
}
