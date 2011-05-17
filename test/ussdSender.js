var appzone = require('appzone');
var assert = require('assert');
var sim = require('../simulator/ussdSimulator');

exports.testSendNormal = function() {
	sim.load(function(simulator, port) {
		
		var url = 'http://localhost:' + port + '/ussd/';
		var appId = 'appID';
		var password = 'pass';
		
		var sender = appzone.sender(url, appId, password);
		var address = 'add';
		var message = 'message1';
		var conversationId = 'converId8238';
		
		var statusCode = 'SBL-USSD-MT-2000';
		var statusDescription = 'SUCCESS';
		
		sender.sendUssd(address, conversationId, message, function(err, status) {
			assert.equal(statusCode, status.statusCode);
			assert.equal(statusDescription, status.statusDescription);
			assert.ok(status.correlationId);
			assert.ok(!status.sessionTermination);
			
			simulator.close();
		});
		
		simulator.onAuth(function(user, pass) {
			assert.equal(user, appId);
			assert.equal(pass, password);
		});
		
		simulator.onMessage(function(ussd) {
			assert.equal(address, ussd.address);
			assert.equal(message, ussd.message);
			assert.equal('1.0', ussd.version);
			assert.equal(conversationId, ussd.conversationId);
			
		});
	});
};

exports.testSendAndFailedOnce = function() {
	sim.load(function(simulator, port) {
		
		var url = 'http://localhost:' + port + '/ussd/';
		var appId = 'appID';
		var password = 'pass';
		
		var sender = appzone.sender(url, appId, password);
		var address = 'add';
		var message = 'message1';
		var conversationId = 'converId8238';
		
		var statusCode = 'SBL-USSD-MT-2000';
		var statusDescription = 'SUCCESS';
		
		sender.sendUssd(address, conversationId, message, function(err, status) {
			assert.equal(statusCode, status.statusCode);
			assert.equal(statusDescription, status.statusDescription);
			assert.ok(status.correlationId);
			assert.ok(!status.sessionTermination);

			simulator.close();
		});
		
		simulator.onAuth(function(user, pass) {
			assert.equal(user, appId);
			assert.equal(pass, password);
		});
		
		var cnt = 0;
		simulator.onMessage(function(ussd) {
			assert.equal(address, ussd.address);
			assert.equal(message, ussd.message);
			assert.equal('1.0', ussd.version);
			assert.equal(conversationId, ussd.conversationId);
			
			
			if(cnt++ < 1) {
				return 'SBL-USSD-MT-5000';
			}
		});
	});
};

exports.testSendAndFailedForever = function() {
	sim.load(function(simulator, port) {
		
		var url = 'http://localhost:' + port + '/ussd/';
		var appId = 'appID';
		var password = 'pass';
		
		var sender = appzone.sender(url, appId, password);
		var address = 'add';
		var message = 'message1';
		var conversationId = 'converId8238';
		
		var statusCode = 'SBL-USSD-MT-2000';
		var statusDescription = 'SUCCESS';
		
		sender.sendUssd(address, conversationId, message, function(err, status) {
			assert.fail();
		});
		
		simulator.onAuth(function(user, pass) {
			assert.equal(user, appId);
			assert.equal(pass, password);
		});
		
		var cnt = 0;
		simulator.onMessage(function(ussd) {
			assert.equal(address, ussd.address);
			assert.equal(message, ussd.message);
			assert.equal('1.0', ussd.version);
			assert.equal(conversationId, ussd.conversationId);
			
			if(++cnt == 5) {
				setTimeout(function() {
					simulator.close();
				}, 200);
			}
			
			return 'SBL-USSD-MT-5000';
		});
	});
};

exports.testSendAndFailedWithUnhandelableStatus = function() {
	sim.load(function(simulator, port) {
		
		var url = 'http://localhost:' + port + '/ussd/';
		var appId = 'appID';
		var password = 'pass';
		
		var sender = appzone.sender(url, appId, password);
		var address = 'add';
		var message = 'message1';
		var conversationId = 'converId8238';
		
		var statusCode = 'SBL-USSD-MT-3434';
		var statusDescription = 'FAILED';
		
		sender.sendUssd(address, conversationId, message, function(err, status) {
			assert.equal(statusCode, status.statusCode);
			assert.equal(statusDescription, status.statusDescription);
			assert.ok(status.correlationId);
			assert.ok(!status.sessionTermination);
			simulator.close();
		});
		
		simulator.onAuth(function(user, pass) {
			assert.equal(user, appId);
			assert.equal(pass, password);
		});
		
		var cnt = 0;
		simulator.onMessage(function(ussd) {
			assert.equal(address, ussd.address);
			assert.equal(message, ussd.message);
			assert.equal('1.0', ussd.version);
			assert.equal(conversationId, ussd.conversationId);
			
			return statusCode;
		});
	});
};

exports.testSendAndTerminate = function() {

	sim.load(function(simulator, port) {
		
		var url = 'http://localhost:' + port + '/ussd/';
		var appId = 'appID';
		var password = 'pass';
		
		var sender = appzone.sender(url, appId, password);
		var address = 'add';
		var message = 'message1';
		var conversationId = 'converId8238';
		
		var statusCode = 'SBL-USSD-MT-2000';
		var statusDescription = 'SUCCESS';
		
		sender.sendUssdAndTerminate(address, conversationId, message, function(err, status) {
			assert.equal(statusCode, status.statusCode);
			assert.equal(statusDescription, status.statusDescription);
			assert.ok(status.correlationId);
			assert.ok(!status.sessionTermination);
			
			simulator.close();
		});
		
		simulator.onAuth(function(user, pass) {
			assert.equal(user, appId);
			assert.equal(pass, password);
		});
		
		simulator.onMessage(function(ussd) {
			assert.equal(address, ussd.address);
			assert.equal(message, ussd.message);
			assert.equal('1.0', ussd.version);
			assert.equal(conversationId, ussd.conversationId);
			
		});
	});
};

exports.testsIncorrectAppzoneHost = function() {

	var url = 'http://localhssost:34' + '/ussd/';
	var appId = 'appID';
	var password = 'pass';
	
	var sender = appzone.sender(url, appId, password);
	var address = 'add';
	var message = 'message1';
	var conversationId = 'converId8238';
	
	var statusCode = 'SBL-USSD-MT-2000';
	var statusDescription = 'SUCCESS';
	
	sender.sendUssdAndTerminate(address, conversationId, message, function(err, status) {
		
		assert.ok(err);
		assert.ok(!status);
	});
};
