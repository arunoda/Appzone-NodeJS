var appzone = require('../lib/appzone');

var receiver = appzone.receiver(4444);
var sender = appzone.sender('http://localhost:8000', "app", "pass");

receiver.onUssdMessage(function(ussd) {
	console.log("USSD message received!");
	sender.sendUssdMessage(ussd.address, ussd.conversationId, '---- ' + ussd.message + ' ----', false, function(status) {
		console.log("USSD MT sent with status: " + JSON.stringify(status));
	});
});