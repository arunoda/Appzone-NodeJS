var assert = require("assert");
var appzoneLib = require('../lib-cov/appzone');

exports.testsBradcast = function() {
	
	require('../simulator/simulator.js').load(function afterStarted(simulator, port) {
		simulator.onMessage(function(sms) {
			assert.equal(sms.message, "hello");
			assert.equal(sms.address, "list:registered");
		});
		
		simulator.onAuth(function(appId, pass) {
			assert.equal(appId, "app");
			assert.equal(pass, "pass");
		});
		
		var appzone = appzoneLib.load("http://localhost:" + port, "app", "pass", 100);
		appzone.broadcast("hello", function(status) {
			assert.equal(status.status_message, "SUCCESS");
			simulator.done();
		});
	});
	
};

exports.testsBradcastRetry = function() {
	
	require('../simulator/simulator.js').load(function afterStarted(simulator, port) {
		simulator.onMessage(function(sms) {
			assert.equal(sms.message, "hello");
			assert.equal(sms.address, "list:registered");
		});
		
		simulator.onAuth(function(appId, pass) {
			assert.equal(appId, "app");
			assert.equal(pass, "pass");
		});
		
		var appzone = appzoneLib.load("http://localhost:" + port, "app", "pass", 100);
		appzone.broadcast("hello", function(status) {
			assert.equal(status.status_message, "SUCCESS");
			simulator.done();
		}, true);
	});
	
};