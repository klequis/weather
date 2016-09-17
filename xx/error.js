<!DOCTYPE html>
<html>
<head>
	<!-- <script src="//code.jquery.com/jquery-2.1.1.min.js"></script> -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
	<!--<link rel="stylesheet" type="text/css" href="style.css">-->
    <meta charset="utf-8">
    <title>Weather</title>
</head>
<body>
<a name="#ajax-getjson-example"></a>
<div id="example-section38">   
    <div>Football weather</div>
    <div id="div381"></div>
    <button id="btn382" type="button">Team location</button>
    <div id="output"></div>
</div>
</body>
</html>

window.addEventListener('error', function(e) {
  console.log(e.lineNumber); // 5
});
var e = new Error('Could not parse input');
throw e;