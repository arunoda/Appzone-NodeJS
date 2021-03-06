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

var rest = require('restler');

exports.load = function(url, appId, password, retryInterval, retryLimit) {
	
	return new UssdSender(url, appId, password, retryInterval, retryLimit);
};

function UssdSender(url, appId, password, retryInterval, retryLimit) {
	
	var sendUssdMessage = function(address, conversationId, message, terminate, callback) {
		
		var headers = {};
		headers['Content-Type'] = 'application/json';
		headers['X-Requested-Version'] = '1.0';
		headers['X-Requested-Encoding'] = 'UTF-8';
		headers['X-Requested-Conversation-ID'] = '' + conversationId;
		
		var body = {
			address: address,
			message: message,
			sessionTermination: '' + terminate
		};
		
		var tries = 0;
		function retrySendUssdMessage(address, conversationId, message, terminate, callback) {
			
			if(++tries > retryLimit) {
				console.error("Maximum retry limit of: " + retryLimit + ' exeeded when requesing USSD message to: ' + address);
			} else {
				rest.post(url + '/ussd', {
					headers: headers,
					data: JSON.stringify(body),
					username: appId,
					password: password
					
				}).on("complete", onUssdAttemptCompleted).on("error", onErrorFired);
			}
		}
		
		function onUssdAttemptCompleted(data, response) {
			
			var retryCodes = ["SBL-USSD-MT-5000", "SBL-USSD-MT-5008", "SBL-USSD-MT-5001",
				  				"SBL-USSD-MT-5004", "CORE-USSD-MT-4049", "CORE-USSD-MT-4030", 
				  				"CORE-USSD-MT-4016"];
			
			if(response.statusCode == 200) {

				var status = data;
				if(retryCodes.contains(status.statusCode)) {
					console.log("retrying for: " + tries + " of USSD message: " + message + 
							" to address:" + address + " with conversationId: " + conversationId);
					retrySendUssdMessage(address, conversationId, message, terminate, callback);
				} else {
					if(callback) callback(null, status);
				}
				
				
				console.info("USSD message send to address: " + address);
			} else {
				console.error("Appzone USSD message sending failed with HTTP response statusCode: " + response.statusCode);
				var err = {
						error: "Appzone USSD message sending failed with HTTP response statusCode: " + response.statusCode,
						address: address,
						message: message,
						conversationId: conversationId
					};
					
				if(callback) callback(err, null);
			}
		}
		
		function onErrorFired(obj, err) {
			
			console.error("Something wrong with the appzone host:" + url + " with error: " + JSON.stringify(err));
			if(callback) callback(err, null);
		}
		
		//Start retry process
		retrySendUssdMessage(address, conversationId, message, terminate, callback, 1);
	};
	
	this.sendUssd = function(address, conversationId, message, callback) {
		sendUssdMessage(address, conversationId, message, false, callback);
	};
	
	this.sendUssdAndTerminate = function(address, conversationId, message, callback) {
		sendUssdMessage(address, conversationId, message, true, callback);
	};
	
}