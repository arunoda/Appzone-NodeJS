var assert = require("assert");
var appzoneLib = require('../lib-cov/appzone');

exports.testsSendMessage = function() {
	
	require('../simulator/simulator.js').load(function afterStarted(simulator, port) {
		simulator.onMessage(function(sms) {
			assert.equal(sms.message, "hello");
			assert.equal(sms.address, "tel:0721222333");
			simulator.done();
		});
		
		simulator.onAuth(function(appId, pass) {
			assert.equal(appId, "app");
			assert.equal(pass, "pass");
		});
		
		var appzone = appzoneLib.load("http://localhost:" + port, "app", "pass", 100);
		appzone.sendMessage("0721222333", "hello", function(status) {
			assert.equal(status.status_message, "SUCCESS");
		});
	});
	
};

exports.testsSendMessageRetryFailedForever = function() {
	
	require('../simulator/simulator.js').load(function afterStarted(simulator, port) {
		var cnt = 0;
		simulator.onMessage(function(sms) {
			assert.equal(sms.message, "hello");
			assert.equal(sms.address, "tel:0721222333");
			sms.statusCode = "SBL-SMS-MT-5000";
			if(++cnt == 5) {
				simulator.done();
			}
		});
		
		simulator.onAuth(function(appId, pass) {
			assert.equal(appId, "app");
			assert.equal(pass, "pass");
		});
		
		var appzone = appzoneLib.load("http://localhost:" + port, "app", "pass", 100);
		appzone.sendMessage("0721222333", "hello", function(status) {
			assert.equal(status.status_code, "SBL-SMS-MT-5000");
		}, true);
	});
	
};

exports.testsSendMessageRetryFailedOnce = function() {
	
	require('../simulator/simulator.js').load(function afterStarted(simulator, port) {
		var cnt = 0;
		simulator.onMessage(function(sms) {
			assert.equal(sms.message, "hello");
			assert.equal(sms.address, "tel:0721222333");
			
			if(cnt++ == 0) {
				sms.statusCode = "SBL-SMS-MT-5000";
			} else {
				sms.statusCode = "SBL-SMS-MT-2000";
			}
		});
		
		simulator.onAuth(function(appId, pass) {
			assert.equal(appId, "app");
			assert.equal(pass, "pass");
		});
		
		var appzone = appzoneLib.load("http://localhost:" + port, "app", "pass", 100);
		appzone.sendMessage("0721222333", "hello", function(status) {
			assert.equal(status.status_code, "SBL-SMS-MT-2000");
			simulator.done();
		}, true);
	});
	
};

exports.testsSendMessageNoHost = function() {
	
	var appzone = appzoneLib.load("http://localhost:3232", "app", "pass", 100);
	appzone.sendMessage("0721222333", "hello", function(status) {
		assert.equal(status.status_code, "SBL-SMS-MT-2000");
		simulator.done();
	}, true);
	
};