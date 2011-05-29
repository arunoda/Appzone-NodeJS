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


	Menu for the Appzone USSD 
	=========================
	usage:
		var menu = require('appzone/menu');
		var subMenu = menu('sub').
			title('The Sub Menu').
			item('one').on('Thanks');
			
		var mainMenu = menu('main').
			title('The Main Menu goes Here').
			item('random').on(function(itemName) {
				return '' + Math.random();
			}),
			item('next').on(subMenu);
		
 */


exports = function(name) {
	return new Menu(name);
};

function Menu(name) {
	
	var self = this;
	var title = name;
	var items = [];
	var itemNames = [];
	var messageLenghtLimit = 160;
	
	/**
	 * Set the title of the Menu
	 * @param t - the title name
	 * @returns menu object itself
	 */
	this.title = function(t) {
		title = t;
		return self;
	};
	
	/**
	 * Add an item to the menu
	 * @param itemName - name of the item
	 * @returns object(with on function) to attach how to handle the menu item when triggered
	 * 	## Syntax
	 * 		{ on: function(response) {}}
	 * 		response could contain 3 types of parameters
	 * 			String
	 * 			Callback - returning String or AnotherMenu and accepting itemName
	 * 			Another Menu
	 */
	this.item = function(itemName) {
		
		function whenTriggered(response) {
			var wc = countMessageLength(itemName);
			if(wc > messageLenghtLimit) {
				throw new Error('messagelimit is defined as: ' + messageLenghtLimit + ' and it has exceeded to: ' + wc);
			} else if(validateResponse(response)) { 
				items[itemName] = response; //hash lookups are quick
				itemNames.push(itemName); //in order to preserve the preceding order
				return self;
			} else {
				throw new Error('paramter for on() should be either String, Callback or another menu');
			}
		}
		
		function countMessageLength(newItem) {
			
			var wc = title.length + 1; //newLine and the title
			for(var index in itemNames) {
				wc += itemNames[index].length;
				if(index < 10) {
					wc += 1;
				} else {
					wc += 2;
				}				
			}
			wc += 3; //for the '. ' and newLine at the end of each message
			wc += 2 + 2 + newItem.length + 1; //for the new Item
			
			return wc;
		}
		
		return {
			on: whenTriggered
		};
	};
	
	/***
	 * Validate the response in on
	 * @param resp - response value
	 * @returns boolean - indicating whether validated or not
	 */
	function validateResponse(resp) {
		
		if(resp instanceof String) {
			return true;
		} else if(resp instanceof Function) {
			return true;
		} else if(typeof(resp) == 'object'){
			//check for menu item
			var title = resp['title'] instanceof Function;
			var item = resp['item'] instanceof Function;
			var when = resp['when'] instanceof Function;
			var render = resp['render'] instanceof Function;
			
			return title && item && when && render;
		}
		
		return false;
	}
	
	/**
	 * Set the message length limit which default is 160 (USSD and SMS compatible)
	 */
	this.setMessageLenghtLimit = function(limit) {
		messageLenghtLimit = limit;
	};
	
	/**
	 * Return the response when some item is triggered
	 * @param itemName - Name of the Item
	 * @returns response of the item as String or another Menu Object
	 * @throws when item cannot be found
	 */
	this.when = function(itemName) {

		var response = items[itemName];
		if(!response) {
			throw new Error('there is no such item named: ' + itemName + ' in menu: ' + name);
		} else if(response instanceof String) {
			return response;
		} else if(response instanceof Function) {
			return response(itemName);
		} else {
			//returning the menuObject
			return response;
		}
	};
	
	/**
	 * Render the menu as a string and can be used to send as a String Message (possibly USSD or SMS)
	 * @return the message String
	 */
	this.render = function() {
		
		var message = title + '\n';
		for(var index in itemNames) {
			message += index + '. ' + itemNames[index] + '\n';
		}
		return message;
	};
	
}