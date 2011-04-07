var appzone = require("../lib/appzone").
	load("http://localhost:8008/simulator", "app", "pass");

appzone.receive(8080, function(sms) {
	appzone.sendMessage(sms.address, 'echo: ' + sms.message);
//	console.log(sms);
});