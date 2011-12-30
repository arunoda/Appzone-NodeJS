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

exports.load = function(url, appId, password, retryInterval, retryLimit) {
	return new Sender(url, appId, password, retryInterval, retryLimit);
};

/**
 * Appzone Message Sender
 * ----------------------
 * This handles all the message sending types to the Appzone Servers
 * All the messages will be retied if any of them failed to send
 * And retying parameters can be change by altering following optional parameters
 * 
 * @param url - url of the Appzone Server eg:- http://localhost:8000
 * @param appId - appId for appzone
 * @param password - password for appzone
 * @param retryInterval (optional) - the Interval between retry message sending 
 * 	if a message failed to send correctly. Default is 30 seconds.
 * @param retryLimit (optional)- no retries before give up sending the message. 
 * 	Default is 5
 */
function Sender(url, appId, password, retryInterval, retryLimit) {
	
	retryInterval = (retryInterval)? retryInterval: 30000;
	retryLimit = (retryLimit)? retryLimit: 5;
	
	var ussd = require('./ussdSender').load(url, appId, password, retryInterval, retryLimit);
	var sms = require('./smsSender').load(url, appId, password, retryInterval, retryLimit);
	
	/**
	 * Send an SMS 
	 * 
	 * @param address - address where SMS needs to be sent
	 * @param message - the content of the SMS
	 * @param callback - calls after the after sending the message
	 * 	format: function(err, status)
	 * 		err: Error Object if there is an error, otherwise null
	 * 		status: Status of the message format will be 
	 * 			{correlationId: 343434, statusCode: "SBL-MT-2000", statusDescription: "SUCCESS"}
	 */
	this.sendSms = function(address, message, callback) {
		sms.sendSms(address, message, callback);
	};
	
	/**
	 * Broadcast the message to all the subscribers
	 * 
	 * @param message - the content of the SMS
	 * @param callback - calls after the after sending the message
	 * 	format: function(err, status)
	 * 		err: Error Object if there is an error, otherwise null
	 * 		status: Status of the message format will be 
	 * 			{correlationId: 343434, statusCode: "SBL-MT-2000", statusDescription: "SUCCESS"}
	 */
	this.broadcastSms = function(message, callback) {
		sms.broadcastSms(message, callback);
	};
	
	/**
	 * Send the USSD message to a given address for a given conversation Id
	 * And the after this message sends out the current session is already exists.
	 * So later on user can communicate with this conversation
	 * 
	 * @param address - address of the receiver
	 * @param conversationId - conversation related; This can be retreived via 
	 * 	the USSD message received before
	 * @param message - the content of the USSD
	 * @param callback - calls after the after sending the message
	 * 	format: function(err, status)
	 * 		err: Error Object if there is an error, otherwise null
	 * 		status: Status of the message format will be 
	 * 			{correlationId: 343434, statusCode: "SBL-MT-2000", statusDescription: "SUCCESS"}
	 */
	this.sendUssd = function(address, conversationId, message, callback) {
		ussd.sendUssd(address, conversationId, message, callback);
	};
	
	/**
	 * Send the USSD message to a given address for a given conversation Id
	 * After this message conversation between the User and The Application will be terminated
	 * 
	 * @param address - address of the receiver
	 * @param conversationId - conversation related; This can be retreived via 
	 * 	the USSD message received before
	 * @param message - the content of the USSD
	 * @param callback - calls after the after sending the message
	 * 	format: function(err, status)
	 * 		err: Error Object if there is an error, otherwise null
	 * 		status: Status of the message format will be 
	 * 			{correlationId: 343434, statusCode: "SBL-MT-2000", statusDescription: "SUCCESS"}
	 */
	this.sendUssdAndTerminate = function(address, conversationId, message, callback) {
		ussd.sendUssdAndTerminate(address, conversationId, message, callback);
	};
}