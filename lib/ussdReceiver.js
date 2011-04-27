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

var TYPE = {
		USSD_MESSAGE: "X-USSD-Message",
		USSD_TERMINATE: "X-USSD-Terminate-Message",
		USSD_ALIVE: "X-USSD-Alive-Message"
};

exports.handle = function(req, res, events) {
	
	var messageType = req.headers['x-message-type'];
	console.log("getting ussd message type: " + messageType);
	
	if(messageType == TYPE.USSD_MESSAGE) {
		
		handleNormalUssdMessage();
	} else if(messageType == TYPE.USSD_TERMINATE) {
		
		handleTerminateMessage();
	} else if(messageType == TYPE.USSD_ALIVE) {
		 
		handleAliveMesssage();
	} else {
		
		console.log("Unidentified USSD message type: " + messageType);
		res.writeHead(404);
		res.end();
	}
	
	function handleNormalUssdMessage() {
		
		var ussd = {
				address: req.body.address,
				conversationId: req.headers['x-requested-conversation-id'],
				message: req.body.message,
				correlationId: req.body.correlationId,
				version: req.headers['x-requested-version']
		};
		console.log("handling normal ussd message as: " + JSON.stringify(ussd));
		
		events.emit("ussd", ussd);
		res.writeHead(200);
	    res.end("");
	}
	
	function handleTerminateMessage() {
		
		var ussd = {
				address: req.body.address,
				conversationId: req.headers['x-requested-conversation-id'],
				correlationId: req.body.correlationId,
				version: req.headers['x-requested-version']
		};
		
		console.log("handling terminate ussd message as: " + JSON.stringify(ussd));
		
		events.emit("ussdTerminate", ussd);
		res.writeHead(200);
	    res.end("");
	}
	
	function handleAliveMesssage() {
		
		console.log("handling ussd alive message");
		res.writeHead(202);
	    res.end("");
	}
};