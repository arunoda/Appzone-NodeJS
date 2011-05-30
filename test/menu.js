var menu = require('menu');
var assert = require('assert');

exports.testsStringItem = function() {
	
	var main = menu('main').
		title('the title').
		item('one').on('hello');
	
	var message = "the title\n1. one\n";
	assert.equal(main.render(), message);
	assert.equal(main.when(1), 'hello');
	assert.throws(function() {
		main.when('2');
	});
};

exports.testsOtherMenu = function() {
	
	var sub = menu('sub').item('one').on('thanks');
	var main = menu('main').
		title('the title').
		item('one').on(sub);
	
	var message = "the title\n1. one\n";
	assert.equal(main.render(), message);
	assert.equal(main.when('1'), sub);
};

exports.testsCallbackWithString = function() {
	
	var main = menu('main').
		title('the title').
		item('one').on(function(itemName) {
			return itemName + '+++';
		});
	
	var message = "the title\n1. one\n";
	assert.equal(main.render(), message);
	assert.equal(main.when('1'), 'one+++');
};

exports.testsCallbackWithMenu= function() {
	
	var sub = menu('sub').item('one').on('thanks');
	var main = menu('main').
		title('the title').
		item('one').on(function(itemName) {
			return sub;
		});
	
	var message = "the title\n1. one\n";
	assert.equal(main.render(), message);
	assert.equal(main.when('1'), sub);
};

exports.testsErrorWhenOnMethod= function() {
	
	var main = menu('main').
		title('the title');
	
	assert.throws(function() {
		main.item('sdsd').on({});
	});

};

exports.testsErrorWhenOnMethodIntAdded= function() {
	
	var main = menu('main').
		title('the title');
	
	assert.throws(function() {
		main.item('sdsd').on(1000);
	});

};

exports.testsNoSuchItem = function() {
	var main = menu('main').
	title('the title').
	setMessageLenghtLimit(100);

	assert.throws(function() {
		main.when('sdsd');
	});
};

exports.testsMessgaeLengthLimitExceeded = function() {
	
	assert.throws(function() {
		var main = menu('main').
		title('dsfdsfefer').
		item('dfdds3433444').on('a').
		item('dfddsdssssssss').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a').
		item('dfdds').on('a');
	});
	
};