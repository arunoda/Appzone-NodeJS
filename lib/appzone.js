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

Array.prototype.contains = function(obj) {
	  var i = this.length;
	  while (i--) {
	    if (this[i] === obj) {
	      return true;
	    }
	  }
	  return false;
};

/**
 * Returns an instance of Appzone Sender 
 * 
 * @param url - url of the Appzone Server eg:- http://localhost:8000
 * @param appId - appId for appzone
 * @param password - password for appzone
 * @param retryInterval (optional) - the Interval between retry message sending 
 * 	if a message failed to send correctly. Default is 30 seconds.
 * @param retryLimit (optional)- no retries before give up sending the message. 
 * 	Default is 5
 */
exports.sender = function(url, appId, password, retryInterval, retryLimit) {
	return require('./sender').load(url, appId, password, retryInterval, retryLimit);
};

/**
 * Returns an instance of Appzone Receiver 
 * 
 * @param port - port which listen for messages from Appzone
 */
exports.receiver = function(port, callback) {
	return require('./receiver').load(port, callback);
};