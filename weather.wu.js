"use strict";
const pstart = "<p>";
const pend = "</p>";
const bstart = "<b>";
const bend = "</b>";
const WU_KEY = "8e038883d8fbbe15";
const PROJECT_NAME = "FCC Weather App";
// var bootStrap = require("bootstrap");
/* *******************************/

var url = "http://api.wunderground.com/api/8e038883d8fbbe15";
url += "/conditions/q/CA/San_Francisco.json";

useLocalData();
function useLocalData() {
  loadJSON(function(response) {
  // Parse JSON string into object
    var localData = JSON.parse(response);
    makePageElements(localData);
  });
}

// useAPI();
function useAPI() {
  getWeather(url, function(data) {
    makePageElements(data);
  });
}

function getWeather(url, callback) {
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


// Thu 15 Sep 2016 04:17:13 PM PDT GMT-7:00 DST
// 1473981433

function makePageElements(data) {

  var location = data.current_observation.display_location.full;
  appendToElement("title", location);

  // var time = data.current_observation.observation_time;
  var epoch = data.current_observation.local_epoch;
  var dateTime = moment.unix(epoch).format("MMM D, YYYY h:mm a");
  appendToElement("sub-title", dateTime);

  var temp_f = data.current_observation.temp_f;
  var temp_c = data.current_observation.temp_c;
  appendToElement("temperature", temp_f);

  var weather = data.current_observation.weather; // cloudy, sunny, etc
  // makeElement("conditions", "p", weather);
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
  appendTableRow("tbl-details", dewPoint_f + " " + pressureTrend);

}

function appendToElement(parentId, text) {
  var ele = document.getElementById(parentId);
  var txt = document.createTextNode(text);
  ele.appendChild(txt);
}

function makeElement(parentId, elementType, text) {
  // document.write(pstart + text + pend);
  // document.write(parentId + ", " + elementType + ", " + text);
  var ele = document.createElement(elementType);
  var txt = document.createTextNode(text);
  ele.appendChild(txt);
  document.getElementById(parentId).appendChild(ele);
}

function appendTableRow(parentId, text) {
  /*
  var tbl = document.getElementById(parentId);
  var txt = document.createTextNode(text);
  tbl.appendChild(txt);
  */
  var tbl = document.getElementById(parentId);
  var row = tbl.insertRow();
  var cell = row.insertCell();
  cell.innerHTML = text;
}

function appendImage(parentID, src) {
  var img = document.createElement("img");
  img.src = src;
  document.getElementById(parentID).appendChild(img);
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
/* *******************************/

function t(text) {
  document.write(text);
}

function wval(desc, value) {
  document.write(pstart + bstart + desc + bend + " = " + value + pend);
}

function h1(text) {
  whead(text, 1);
}

function h2(text) {
  whead(text, 2);
}

function h3(text) {
  whead(text, 3);
}

function h4(text) {
  whead(text, 4);
}

function whead(text, level) {
  var val = level ? level : 1;
  var h = document.createElement("h" + val);
  var t = document.createTextNode(text);
  h.appendChild(t);
  document.body.appendChild(h);
}
