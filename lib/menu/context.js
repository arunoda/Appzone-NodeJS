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


	Context where Menu and it's related submen's will be handles
	============================================================
	Handle Menu with keeping the current state (menu) of the menu provided in the memory
		
 */
var menu = require('../menu');

module.exports = function(mainMenu) {
	return new MenuContext(mainMenu);
};

function MenuContext(mainMenu) {
	
	var currentMenu = mainMenu;
	var INVALID_REQUEST = 'you\'ve answered the wrong option. please try again';
	
	this.respond = function(request) {
		
		if(request != null && typeof(request) !=='string' && typeof(request) !== 'number') {
			throw new Error('only string are allowed to be responded');
		} else if(request == null || (typeof(request) =='string' && request.trim() === '')) {
			//show the currentMenu
			return renderCurrentMenu();
		} else {
			
			try{
				var response = currentMenu.when(request);
				return handleResponse(response);
			} catch(err) {
				//when no such menu item not exists
				return handleInvalidRequest();
			}
		}
		
		function handleResponse(response) {
			
			if(typeof(response) === 'string') {
				return {
					message: response,
					terminate: true
				};
			} else {
				//if response is another menu
				currentMenu = response;
				return renderCurrentMenu();
			}
		}
		
		function handleInvalidRequest() {
			//check to see if the current menu is a Invalid response menu
			if(!currentMenu.invalidRequest) {
				var invalid = menu('invalid').
					title(INVALID_REQUEST).
					item('go back').on(currentMenu);
				invalid.invalidRequest = true;
				currentMenu = invalid;
			} 
			
			return renderCurrentMenu();
		}
	};
	
	function renderCurrentMenu() {
		return {
			message: currentMenu.render(),
			terminate: false
		};
	}
}