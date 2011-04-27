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

var connect = require('connect');
var qbox = require('qbox');

//handlers
var sms = require('./smsReceiver');
var ussd = require('./ussdReceiver');

exports.load = function(port) {
	return new Receiver(port);
};

/**
 * Receiver where receive message from Appzone
 * 
 * @param port - port which listen for messages from Appzone
 */
function Receiver(port) {
	
	var EventEmitter = require("events").EventEmitter;
	var events = new EventEmitter;
	console.log(events);
	
	var $ = qbox.create();
	var app = connect.createServer(
			connect.logger(),
			connect.bodyParser(), 
		    receiveLogic
	);
	app.listen(port, function() {
		$.start();
	});
	
	function receiveLogic(req, res) {
		
		if(req.method.toUpperCase() == "POST") {
			
			if(/^\/ussd/i.exec(req.url)) {
				ussd.handle(req, res, events);
			} else {
				sms.handle(req, res, events);
			}
			
		} else {
			console.info("unsupported method: " + req.method + " received");
			res.writeHead(404, {"Content-Type": "text/plain"});
		    res.end("Please provide all the required paramerers");
		}
		
	}
	
	//public methodds
	
	/**
	 * Register a callback when a new SMS arrives
	 * 
	 * @param callback - callback to be registered
	 * 	format: function(sms) {}
	 * 		sms: The SMS received as 
	 * 			{address: "234343", message: "dscdfHh", correlator: "434", version: "1.0"}
	 */
	this.onSms = function(callback) {
		events.on('sms', callback);
	};
	
	/**
	 * Register a callback when a new USSD Normal Message arrives
	 * 
	 * @param callback - callback to be registered
	 * 	format: function(sms) {}
	 * 		sms: The SMS received as 
	 * 			{address: "234343", message: "dscdfHh", correlatationId: "434", 
	 * 			 conversationId: "343434394893", version: "1.0"}
	 */
	this.onUssd = function(callback) {
		events.on('ussd', callback);
	};
	
	/**
	 * Register a callback when a new USSD Terminate Message arrives
	 * This indicates the conversation session has been terminated there after
	 * 
	 * @param callback - callback to be registered
	 * 	format: function(sms) {}
	 * 		sms: The SMS received as 
	 * 			{address: "234343", correlatationId: "434", 
	 * 			 conversationId: "343434394893", version: "1.0"}
	 */
	this.onUssdTerminate = function(callback) {
		events.on('ussdTerminate', callback);
	};
	
	/**
	 * This will closed the this receiver's behavior of listen for messgaes
	 * 
	 * @param callback = The callback to be called after this closed
	 * 	format: function() {}
	 */
	this.close = function(callback) {
		
		$.ready(function() {
			app.close();
			if(callback) callback();
		});
	};
}