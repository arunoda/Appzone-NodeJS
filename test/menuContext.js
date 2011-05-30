var menu = require('menu');
var menuContext = require('menu/context');
var assert = require('assert');

exports.testsRespondForEmptyOneMenu = function() {
	var main = menu('main').
		title('main menu').
		item('one').on('hello');
	
	var expectedResponse = {
		message: 'main menu\n1. one\n',
		terminate: false
	};
	
	var context = menuContext(main);
	var response = context.respond('');
	assert.deepEqual(response, expectedResponse);
	response = context.respond('');
	assert.deepEqual(response, expectedResponse);
	response = context.respond(null);
	assert.deepEqual(response, expectedResponse);
};

exports.testsRespondInvalidRequestType = function() {
	var main = menu('main').
		title('main menu').
		item('one').on('hello');
	
	var context = menuContext(main);
	assert.throws(function() {
		var response = context.respond(true);
		console.log(response);
	});
};

exports.testsMenuAccessInSingleMenu = function() {
	
	var main = menu('main').
		title('main menu').
		item('one').on('hello');
	
	var expectedResponse = {
		message: 'hello',
		terminate: true
	};
	
	var context = menuContext(main);
	var response = context.respond('1');
	assert.deepEqual(response, expectedResponse); 
};

exports.testsAccessMultipleMenus = function() {
	
	var mOne = menu('mOne').
		item('go').on('hello');
	
	var mTwo = menu('mTwo').
		item('one').on(mOne);
	
	var main = menu('main').
		item('two').on(mTwo);
	
	var context = menuContext(main);
	assert.deepEqual(context.respond(''), {message: main.render(), terminate: false});
	assert.deepEqual(context.respond('1'), {message: mTwo.render(), terminate: false});
	assert.deepEqual(context.respond('1'), {message: mOne.render(), terminate: false});
	assert.deepEqual(context.respond('1'), {message: 'hello', terminate: true});
	
};

exports.testsAccessMultipleMenusWithInvalidRequests = function() {
	
	var mOne = menu('mOne').
		item('go').on('hello');
	
	var mTwo = menu('mTwo').
		item('one').on(mOne);
	
	var main = menu('main').
		item('two').on(mTwo);
	
	var invalidMenu = "you've answered the wrong option. please try again\n1. go back\n";
	var context = menuContext(main);
	assert.deepEqual(context.respond(''), {message: main.render(), terminate: false});
	assert.deepEqual(context.respond('dsds sdd'), {message: invalidMenu, terminate: false}); //display go back menu
	assert.deepEqual(context.respond('dsds sdd'), {message: invalidMenu, terminate: false}); //display go back menu
	assert.deepEqual(context.respond('1'), {message: main.render(), terminate: false}); //respond to go back and display main menu
	assert.deepEqual(context.respond('1'), {message: mTwo.render(), terminate: false});
	assert.deepEqual(context.respond('1'), {message: mOne.render(), terminate: false});
	assert.deepEqual(context.respond('1'), {message: 'hello', terminate: true});
	
};