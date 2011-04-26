var singleton = null;
var connect = require('connect');
var startingPort = 9000;

exports.load = function(afterStarted) {
	
	new Simulator(startingPort++, afterStarted);
};

function Simulator(port, afterStarted) {
	
	var correlator = 0;
	var onMessageCallback = null;
	var onAuthCallback = null;
	var that = this;
	
	var app = connect.createServer(
			connect.basicAuth(whenAuth),
			connect.bodyParser(),
			function(req, res, next) {
		
			var sms = {
					address: req.body.address,
					message: req.body.message,
					version: req.body.version
			};
			
			console.log("receiving sms: " + JSON.stringify(sms));
			
			var statusCode = "SBL-SMS-MT-2000";
			var statusMessage = "SUCCESS";
			if(onMessageCallback) {
				console.log("calling the onMessage callback with sms: " + JSON.stringify(sms));
				var forceStatusCode = onMessageCallback(sms);
				console.log("-------------------------" + JSON.stringify(sms));
				
				if(sms.statusCode) {
					statusCode = sms.statusCode;
					statusMessage = "FAILED";
				}
			}
			
			var response = generateXMLResponse(++correlator, statusCode, statusMessage);
			console.log("sending the response: " + response);
			res.writeHead(200, {"Content-Type": "text/xml"});
			res.end(response);
	});
	
	console.log("Simulator started on port: " + port);
	app.listen(port, function() {
		//after the server started
		afterStarted(that, port);
	});
	
	function whenAuth(user, pass) {
//		console.log("calling the onAuth callback with user: " + user + " pass: " + pass);
		if(onAuthCallback) {
			onAuthCallback(user, pass);
		}
		return true;
	}
	
	this.onMessage = function(callback) {
		onMessageCallback = callback;
	};
	
	this.onAuth = function(callback) {
		onAuthCallback = callback;
	};
	
	this.done = function() {
		app.close();
	};
	
}

function generateXMLResponse(correlator, errorCode, errorMessage) {

	var xmlString = "<mchoice_sdp_sms_response>\n" + "   <version>1.0</version>\n" + "   <correlator>"
			+ correlator + "</correlator>\n" + "   <status_code>" + errorCode + "</status_code>\n"
			+ "   <status_message>" + errorMessage + "</status_message>\n" + "</mchoice_sdp_sms_response>\n";

	return xmlString;
}