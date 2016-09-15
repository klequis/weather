"use strict"
const pstart = '<p>';
const pend = '</p>';
const bstart = '<b>';
const bend = '</b>';
const WU_KEY = "8e038883d8fbbe15";
const PROJECT_NAME = "FCC Weather App";

/********************************/



var url = "http://api.wunderground.com/api/8e038883d8fbbe15/conditions/q/CA/San_Francisco.json";
p(url);

var data;

getWeather(url, function(data) {
  var location = "";
  var ele, txt;
  document.write("hello<br>");
  //wval("full", data.current_observation.display_location.full);
  location = data.current_observation.display_location.full;
  ele = document.getElementById('location');
  txt = document.createTextNode(location);
  //ele.append(txt);

  wval("image.url", data.current_observation.image.url);
	wval("observation_time", data.current_observation.observation_time);
	wval("weather", data.current_observation.weather);
	wval("temperature", data.current_observation.temperature_string);
	wval("humidity", data.current_observation.relative_humidity);
	wval("wind_string", data.current_observation.wind_string);
	wval("Feelslike", data.current_observation.feelslike_string);
	wval("icon_url", data.current_observation.icon_url);
	wval("forcast_url", data.current_observation.forecast_url);

  });

function getWeather(url, callback) {
  $.ajax({
    dataType: "jsonp",
    url: url,
    jsonCallback: 'jsonp',
    //data: { lat: coords[0], lon: coords[1] },
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
    //alert("the request is complete!");
  });
}

/********************************/

function t(text) {
  document.write(text);
}

function p(text) {
  document.write(pstart + text + pend);
}

function wval(desc, value) {
  /*
  var pstart = '<p>';
  var pend = '</p>';
  var bstart = '<b>';
  var bend = '</b>';
  */
  document.write(pstart + bstart + desc + bend + ' = ' + value + pend);
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
  var h = document.createElement('h' + val);
  var t = document.createTextNode(text);
  h.appendChild(t);
  document.body.appendChild(h);
}
