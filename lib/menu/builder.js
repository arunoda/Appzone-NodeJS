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


	Appzone Menu builder for NodeJS
	============================================================
	Automatically Create and responds to menu with using the session Info
		
 */

/**
 * Build a menu and respond to users automatically
 * 
 * @param sender - configured Appzone Sender 
 * @param receiver - configured Appzone Receiver
 * @param menu - menu containing all the sub menus
 */

var menuContext = require('./context');

module.exports = function(sender, receiver, menu) {
	return new Builder(sender, receiver, menu);
};

function Builder(sender, receiver, menu) {
	
	//containing menu contexts for each session
	var sessionContexts= [];

	//watching for USSD Messages
	receiver.onUssd(whenUssdMassage);

	//watching for USSD Terminate Event
	receiver.onUssdTerminate(whenUssdTerminated);

	function whenUssdMassage(ussd) {
		
		var context = sessionContexts[ussd.conversationId];
		if(!context) {
			sessionContexts[ussd.conversationId] = menuContext(menu);
			context = sessionContexts[ussd.conversationId];
		}

		var response = context.respond(ussd.message);

		if(response.terminate) {
			//when asks to terminate the session
			sender.sendUssdAndTerminate(ussd.address, ussd.conversationId, response.message, afterUssdSent);
			delete sessionContexts[ussd.conversationId];
		} else {
			sender.sendUssd(ussd.address, ussd.conversationId, response.message, afterUssdSent);
		}

		function afterUssdSent(err, resp) {

			if(err) {
				console.error('ussd menu message:%s send to: %s failed: %s', response.message, ussd.address, JSON.stringify(err));		
			} 
		}
	}

	function whenUssdTerminated(ussd) {
		
		delete sessionContexts[ussd.conversationId];
	}
}