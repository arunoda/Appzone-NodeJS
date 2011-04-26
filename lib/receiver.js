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
var sms = require('./sms');

exports.load = function(port) {
	return new Receiver(port);
};

function Receiver(port) {
	
	var EventEmitter = require("events").EventEmitter;
	var events = new EventEmitter;
	console.log(events);
	
	var $ = qbox.create();
	var app = connect.createServer(
			connect.bodyParser(), 
		    receiveLogic
	);
	app.listen(port, function() {
		$.start();
	});
	
	function receiveLogic(req, res) {
		
		if(req.method.toUpperCase() == "POST") {
			sms.handle(req, res, events);
		} else {
			console.info("unsupported method: " + req.method + " received");
			res.writeHead(404, {"Content-Type": "text/plain"});
		    res.end("Please provide all the required paramerers");
		}
		
	}
	
	//public methods
	
	this.onSms = function(callback) {
		events.on('sms', callback);
	};
	
	this.onUssdMessage = function(callback) {
		events.on('ussdMessage', callback);
	};
	
	this.onUssdTerminate = function(callback) {
		events.on('ussdTerminate', callback);
	};
	
	this.close = function(callback) {
		
		$.ready(function() {
			app.close();
			if(callback) callback();
		});
	};
}