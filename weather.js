"use strict"
const pstart = '<p>';
const pend = '</p>';
const bstart = '<b>';
const bend = '</b>';

/********************************/



var url = 'http://api.openweathermap.org/data/2.5/weather?id=5392593&APPID=cd605b9a7b8b517b82492ee7bf47a295&units=fahrenheit';
p(url);

var data;

getWeather(url, function(data) {
  document.write("hello<br>");
  var city = data.name;
  p("City is: " + city);
  var dateString = data.dt;
  p("dateString = " + dateString);
  var skies = data.weather[0].main;
  p("skies = " + skies);
  var skiesDesc = data.weather[0].description;
  p("skiesDesc = " + skiesDesc);
  var skiesIcon = data.weather[0].icon;
  p("skiesIcon = " + skiesIcon);
  var currTemp = data.main.temp;
  p("currentTemp = " + Math.round(currTemp));
  var pressure = data.main.pressure;
  p("pressure = " + pressure);
  var humidity = data.main.humidity;
  p("humidity = " + humidity);
  var minTemp = data.main.temp_min;
  p("minTemp = " + Math.round(minTemp));
  var maxTemp = data.main.temp_max;
  p("maxTemp = " + Math.round(maxTemp));
  var windSpeed = data.wind.speed;
  p("windSpeed = " + Math.round(windSpeed));
  var sunrise = data.sys.sunrise;
  p("sunrise = " + moment.unix(sunrise).format("hh:mm:ss"));
  var sunset = data.sys.sunset;
  p("sunset = " + moment.unix(sunset).format("hh:mm:ss"));
  moment.unix(dateString).format("MM/DD/YYYY hh:mm:ss");
  var formattedTime = moment.unix(dateString).format("MM/DD/YYYY hh:mm:ss");
  p("formattedTime = " + formattedTime);

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
