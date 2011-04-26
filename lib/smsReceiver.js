/**

	The MIT License
	
	Copyright (c) 2011 Arunoda Susiripala
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyrighurl, appId, passwordt notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

 */
exports.handle = function (req, res, events) {
	
	var message = {
	    	version: req.body.version,
	    	address: req.body.address,
	    	message: req.body.message,
	    	correlator: req.body.correlator
    };
	    
	if(requestCheck(message)) {
		console.info("receiving SMS from appzone: " + JSON.stringify(message));
	    events.emit("sms", message);

	    res.writeHead(200, {"Content-Type": "text/plain"});
	    res.end("");
	} else {
		console.info("few of required parameters are not exists. current requets: " + JSON.stringify(message));
		res.writeHead(404, {"Content-Type": "text/plain"});
	    res.end("Please provide all the required paramerers");
	}
};

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