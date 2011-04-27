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
	return new Sender(url, appId, password, retryInterval, retryLimit);
};

function Sender(url, appId, password, retryInterval, retryLimit) {
	
	retryInterval = (retryInterval)? retryInterval: 30000;
	retryLimit = (retryLimit)? retryLimit: 5;
	
	var ussd = require('./ussdSender').load(url, appId, password, retryInterval, retryLimit);
	var sms = require('./smsSender').load(url, appId, password, retryInterval, retryLimit);
	
	this.sendSms = function(address, message, callback) {
		sms.sendSms(address, message, callback);
	};
	
	this.broadcastSms = function(message, callback) {
		sms.broadcastSms(message, callback);
	};
	
	this.sendUssdMessage = function(address, conversationId, message, terminate, callback) {
		ussd.sendUssdMessage(address, conversationId, message, terminate, callback);
	};
}