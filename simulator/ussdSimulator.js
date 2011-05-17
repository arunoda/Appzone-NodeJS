var singleton = null;
var connect = require('connect');
var startingPort = 10000;

exports.load = function(afterStarted) {
	
	new Simulator(startingPort++, afterStarted);
};

function Simulator(port, afterStarted) {
	
	var correlator = 32;
	var onMessageCallback = null;
	var onAuthCallback = null;
	var alteredResponse = null;
	var that = this;
	
	var app = connect.createServer(
			connect.basicAuth(whenAuth),
			connect.bodyParser(),
			function(req, res, next) {
				
				var ussd = {
						address: req.body.address,
						message: req.body.message,
						sessionTermination: req.body.sessionTermination,
						conversationId: req.headers['x-requested-conversation-id'],
						version: req.headers['x-requested-version']
				};
				
				console.log("receiving ussd: " + JSON.stringify(ussd));
				
				var statusCode = "SBL-USSD-MT-2000";
				var statusMessage = "SUCCESS";
				if(onMessageCallback) {
					console.log("calling the onMessage callback with ussd: " + JSON.stringify(ussd));
					var forceStatusCode = onMessageCallback(ussd);
					console.log("-------------------------" + forceStatusCode);
					
					if(forceStatusCode) {
						statusCode = forceStatusCode;
						statusMessage = "FAILED";
					}
				}
				
				var response = {
						correlationId: correlator++,
						statusCode: statusCode,
						statusDescription: statusMessage
				};
				
				console.log("sending the response: " + JSON.stringify(response));
				if(alteredResponse) {
					res.writeHead(alteredResponse.statusCode, alteredResponse.headers);
					res.end(' ');
				} else {
					res.writeHead(200, {"Content-Type": "application/json"});
					res.end(JSON.stringify(response));
				}
				
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
	
	this.response = function(response) {
		alteredResponse = response;
	};
	
	this.close = function() {
		app.close();
	};
	
}

function generateXMLResponse(correlator, errorCode, errorMessage) {

	var xmlString = "<mchoice_sdp_sms_response>\n" + "   <version>1.0</version>\n" + "   <correlator>"
			+ correlator + "</correlator>\n" + "   <status_code>" + errorCode + "</status_code>\n"
			+ "   <status_message>" + errorMessage + "</status_message>\n" + "</mchoice_sdp_sms_response>\n";

	return xmlString;
}