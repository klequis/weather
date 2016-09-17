/*
   This code is incomplete but may be of use at at later date.
   For the moment I'm using moment.js :)
*/
function formatDateTime(epoch) {
  var utcSeconds = parseInt(epoch, 10);
  var d = new Date(0);
  d.setUTCSeconds(utcSeconds);
  // Thu Sep 15 2016 16:17:13 GMT-0700 (PDT)
  var strDate = d.toString();
  var start = strDate.indexOf("(") + 1;
  alert(strDate.substr(start, 3));

  var mo = getShortMonth(d.getMonth()); // 0 - 11
  var dayOfWk = d.getDay(); // 0 - 6
  var dayInMO = d.getDate();
  var yr = d.getFullYear(); // 4 digits
  var hr = d.getHours(); // 0 - 23
  var min = d.getMinutes(); // 0 - 59
  var sec = d.getSeconds(); // 0 - 59
  // Sep 15, 2016 4:21 pm
  var ret = "mo=" + mo + " day=" + dayInMO + " yr=" + yr + " hr=" + hr;
  ret += " min=" + min + " sec=" + sec;
  return d;
}

function getShortMonth(num) {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
             "Oct", "Nov", "Dec"];
  return months[num];

}
