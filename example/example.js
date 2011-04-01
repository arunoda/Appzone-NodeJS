var appzone = require("../lib/appzone").
	load("http://localhost:8008/simulator", "app", "pass");

appzone.broadcast( "hi", function(resp) {
	console.log(resp);
}, true);

