var assert = require("assert");
var appzone = require('../lib-cov/appzone');

exports.testsSendMessage = function() {
	
	require('../simulator/simulator.js').load(function afterStarted(simulator, port) {
		simulator.onMessage(function(sms) {
			assert.equal(sms.message, "hello");
			assert.equal(sms.address, "tel:0721222333");
		});

		simulator.onAuth(function(appId, pass) {
			assert.equal(appId, "app");
			assert.equal(pass, "pass");
		});
		
		var sender = appzone.sender("http://localhost:" + port, "app", "pass", 100);
		sender.sendSms("0721222333", "hello", function(status) {
			assert.equal(status.status_message, "SUCCESS");
			simulator.close();
		});
	});
	
};

exports.testsSendMessageRetryFailedForever = function() {
	
	require('../simulator/simulator.js').load(function afterStarted(simulator, port) {
		var cnt = 0;
		simulator.onMessage(function(sms) {
			if(cnt++ >= 5) {
				assert.fail("Cannot retry for more than 5 times");
			} else if (cnt == 5) {
				simulator.close();
			}
			assert.equal(sms.message, "hello");
			assert.equal(sms.address, "tel:0721222333");
			sms.statusCode = "SBL-SMS-MT-5000";
		});
		
		simulator.onAuth(function(appId, pass) {
			assert.equal(appId, "app");
			assert.equal(pass, "pass");
		});
		
		var sender = appzone.sender("http://localhost:" + port, "app", "pass", 100);
		sender.sendSms("0721222333", "hello", function(status) {
			assert.equal(status.status_code, "SBL-SMS-MT-5000");
		});
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
		
		var sender = appzone.sender("http://localhost:" + port, "app", "pass", 100);
		sender.sendSms("0721222333", "hello", function(status) {
			assert.equal(status.status_code, "SBL-SMS-MT-2000");
			simulator.close();
		});
	});
	
};

exports.testsSendMessageNoHost = function() {
	
	var sender = appzone.sender("http://localhost:3136", "app", "pass", 100);
	sender.sendSms("0721222333", "hello", function(status) {
		assert.equal(status.status_code, "SBL-SMS-MT-2000");
		simulator.close();
	});
	
};

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
		
		var sender = appzone.sender("http://localhost:" + port, "app", "pass", 100);
		sender.broadcastSms("hello", function(status) {
			assert.equal(status.status_message, "SUCCESS");
			simulator.close();
		});
	});
	
};