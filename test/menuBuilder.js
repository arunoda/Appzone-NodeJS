var menu = require('menu');
var menuBuilder = require('menu/builder');
var assert = require('assert'); 
var nodemock = require('nodemock');

var subMenu = menu('sub').
	title('submenu').
	item('exit').on('you exited');

var mainMenu = menu('main').
	title('mainmenu').
	item('sub').on(subMenu);

exports.testsSimpleResponse = function() {

	var address = '3434';
	var conversationId = 'ddhfwef2';
	var ctrl = {};

	var sender = {
		cnt: 0,
		sendUssd: function(address_, conversationId_, message_) {
			assert.equal(address_, address);
			assert.equal(conversationId_, conversationId);

			switch(++this.cnt) {
				case 1:
					assert.equal(mainMenu.render(), message_);
					ctrl.trigger({address: address, conversationId: conversationId, message: '1'});
					break;
				case 2:
					assert.equal(subMenu.render(), message_);
					ctrl.trigger({address: address, conversationId: conversationId, message: '1'});
					break;
				case 1:
					assert.equal('you exited', message_);
					break;
				default:
					break;	
			}
		},

		sendUssdAndTerminate: function(address_, conversationId_, message_) {
			assert.equal(address_, address);
			assert.equal(conversationId_, conversationId);
			assert.equal('you exited', message_);
		}
	};

	var receiver = nodemock.mock('onUssd').
		takes(function() {}).
		ctrl(0, ctrl); 

	receiver.mock('onUssdTerminate').takes(function() {});
	menuBuilder(sender, receiver, mainMenu);

	ctrl.trigger({
		address: address,
		conversationId: conversationId,
		message: ''
	});
};

exports.testsMultiSession = function() {

	var address = 'aade';
	var ctrl = {};

	var sender = nodemock.mock('sendUssd').takes(address, '1', mainMenu.render(), function() {});
	sender.mock('sendUssd').takes(address, '2', mainMenu.render(), function() {}).calls(3, [{}, null]); //simulate error message send
	sender.mock('sendUssd').takes(address, '2', subMenu.render(), function() {});
	sender.mock('sendUssd').takes(address, '2', mainMenu.render(), function() {});

	var receiver = nodemock.mock('onUssd').
		takes(function() {}).
		ctrl(0, ctrl); 

	var terminate = {};
	receiver.mock('onUssdTerminate').takes(function() {}).ctrl(0, terminate);
	menuBuilder(sender, receiver, mainMenu);

	ctrl.trigger({
		address: address,
		conversationId: '1',
		message: ''
	});	

	ctrl.trigger({
		address: address,
		conversationId: '2',
		message: ''
	});	

	ctrl.trigger({
		address: address,
		conversationId: '2',
		message: '1'
	});	

	terminate.trigger({
		address: address,
		conversationId: '2'
	});

	ctrl.trigger({
		address: address,
		conversationId: '2',
		message: '1'
	});

};