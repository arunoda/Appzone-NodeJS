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

exports.load = function(url, appId, password, retryInterval, retryLimit) {
	return new SmsSender(url, appId, password, retryInterval, retryLimit);
};

function SmsSender(url, appId, password, retryInterval, retryLimit) {
	
	this.sendSms = function(address, message, callback) {

		message = shrinkSms(message);
		sendMessageRetry("tel:" + address, message, callback, 1);
	};
	
	this.broadcastSms = function(message, callback) {

		message = shrinkSms(message);
		sendMessageRetry("list:all_registered", message, callback, 1);
	};
	
	//Retry code block (recursive)
	var sendMessageRetry = function(address, message, callback, count) {
		
		var retryCodes = ["SBL-SMS-MT-5000", "SBL-SMS-MT-5008", "SBL-SMS-MT-5001",
		  				"SBL-SMS-MT-5004", "CORE-SMS-MT-4049", "CORE-SMS-MT-4030", 
		  				"CORE-SMS-MT-4016"];
		
		if(count> retryLimit) {
			var err = {
				error: "Maximum retry limit of " + retryLimit + " exceeded when sending the message",
				address: address,
				message: message
			};
			
			if(callback) callback(err, null);
			console.error("maximum retry limit exeeded when sending message to: " + url + " for:" + address);
		} else {
			sendMessageLogic(address, message, function(status) {
				
				if(!status || retryCodes.contains(status.statusCode)) {
					console.log("retrying for: " + count + " of message: " + message + " to address:" + address);
					setTimeout(function() {
						sendMessageRetry(address, message, callback, count + 1);
					}, retryInterval);
				} else {
					if(callback) callback(null, status);
				}
			});
		}
		
	};
	
	/*
	 * Logic behind sending the message
	 */
	var sendMessageLogic = function(address, message, callback) {

		rest.post(url, {
			username: appId,
			password: password,
			data: {
				version: "1.0",
				address: address,
				message: message
			}
		}).on("complete", function(data, response) {
			
			if(response.statusCode == 200) {
				parseXML(data, function(status) {
					if(callback) callback(status);
				});
				console.info("message send to address: " + address);
			} else {
				console.error("Appzone Sending message failed with statusCode: " + response.statusCode);
				if(callback) callback(null);
			}
		}).on("error", function(err, err2) {
			console.error("Something wrong with the appzone host:" + url);
			console.error(err2);
			if(callback) callback();
		});
	};
	
	var parseXML = function(data, callback) {
		var p = new xml2js.Parser();
		p.addListener("end", function(obj) {
			var status = {};
			status.statusCode = obj.status_code;
			status.statusDescription = obj.status_message;
			status.correlationId = obj.correlator;
			
			callback(status);
		});
		p.parseString(data);
	};

	/**
		Shrink the message to 160 charactors
	*/
	function shrinkSms(message) {
		
		if(message) {
			return message.trim().substring(0, 160);	
		} else {
			return "";
		}
	}
}
