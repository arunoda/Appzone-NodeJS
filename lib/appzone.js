/**

	The MIT License
	
	Copyright (c) 2011 Arunoda Susiripala
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

 */

var rest = require("restler");
var xml2js = require("xml2js-expat");
var connect = require('connect');

Array.prototype.contains = function(obj) {
	  var i = this.length;
	  while (i--) {
	    if (this[i] === obj) {
	      return true;
	    }
	  }
	  return false;
};

exports.load = function(host, appId, pass) {
	return new Appzone(host, appId, pass);
};

function Appzone(host, appId, pass) {
	
	this.sendMessage = function(address, message, callback, retry) {
		var tries = 0;
		if(retry) {
			sendMessageRetry("tel:" + address, message, callback, 1);
		} else {
			sendMessage_("tel:" + address, message, callback);
		}
	};
	
	this.broadcast = function(message, callback, retry) {
		
		if(retry) {
			sendMessageRetry("list:registered", message, callback, 1);
		} else {
			sendMessage_("list:registered", message, callback);
		}
	};
	
	var sendMessageRetry = function(address, message, callback, count) {
		
		var retryCodes = ["SBL-SMS-MT-5000", "SBL-SMS-MT-5008", "SBL-SMS-MT-5001",
		  				"SBL-SMS-MT-5004", "CORE-SMS-MT-4049", "CORE-SMS-MT-4030", 
		  				"CORE-SMS-MT-4016"];
		
		if(count> 5) {
			console.error("maximum retry limit exeeded when sending message to: " + host + " for:" + address);
		} else {
			sendMessage_(address, message, function(status) {
				
				if(!status || retryCodes.contains(status.status_code)) {
					console.log("retrying for: " + count + " of message: " + message + " to address:" + address);
					setTimeout(function() {
						sendMessageRetry(address, message, callback, count + 1);
					}, 30000);
				} else {
					if(callback) callback(status);
				}
			});
		}
		
	};
	
	var sendMessage_ = function(address, message, callback) {

		rest.post(host, {
			username: appId,
			password: pass,
			data: {
				version: "1.0",
				address: address,
				message: message
			}
		}).on("complete", function(data, response) {
			
			if(response.statusCode == 200) {
				var pasedData = parseXML(data, function(status) {
					if(callback) callback(status);
				});
				console.info("message send to address: " + address);
			} else {
				console.error("Appzone Sending message failed with statusCode: " + response.statusCode);
				if(callback) callback(null);
			}
		}).on("error", function(err) {
			console.error("Something wrong with the appzone host:" + host);
		});
	};
	
	var parseXML = function(data, callback) {
		var p = new xml2js.Parser();
		p.addListener("end", function(obj) {
			callback(obj);
		});
		p.parseString(data);
	};
	
	/**
	 * Receive for SMS on a given port and calls the callback with following object
	 * {
	 * 		version: "1.0",
	 * 		address: "2324324243234",
	 * 		message: "the message content",
	 * 		correlator:	"34343434343"
	 * }
	 */
	this.receive = function(port, callback) {
		
		var app = connect.createServer(
				connect.bodyParser(), 
			    receiveLogic
		).listen(port);
		
		function receiveLogic(req, res) {

			if(req.method.toUpperCase() == "POST") {
				var message = {
				    	version: req.body.version,
				    	address: req.body.address,
				    	message: req.body.message,
				    	correlator: req.body.correlator
				    };
				    
					if(requestCheck(message)) {
						console.info("receiving SMS from appzone: " + JSON.stringify(message));
					    callback(message);

					    res.writeHead(200, {"Content-Type": "text/plain"});
					    res.end("");
					} else {
						console.info("few of required parameters are not exists. current requets: " + JSON.stringify(message));
						res.writeHead(404, {"Content-Type": "text/plain"});
					    res.end("Please provide all the required paramerers");
					}
			} else {
				console.info("unsupported method: " + req.method + " received");
				res.writeHead(404, {"Content-Type": "text/plain"});
			    res.end("Please provide all the required paramerers");
			}
		}
		
		/**
		 * Check the request for all the required parameters
		 */
		function requestCheck(message) {
			for(key in message) {
				if(!message[key]) {
					return false;
				}
			}
			
			return true;
		}
	};
}