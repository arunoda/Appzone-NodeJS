var assert = require("assert");
var appzone = require('appzone');

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
		sender.sendSms("0721222333", "hello", function(err, status) {
			assert.equal(status.statusDescription, "SUCCESS");
			simulator.close();
		});
	});
	
};

exports.testsSendMessageShrinkTo160 = function() {
	
	var message = "111111111111111111111111111342343443534543543534543543543543654645745754654646565788888888888855555555555555555555555555555555555555555555555555555555555555555656";
	require('../simulator/simulator.js').load(function afterStarted(simulator, port) {
		simulator.onMessage(function(sms) {
			assert.equal(sms.message.length, 160);
			assert.equal(sms.address, "tel:0721222333");
		});

		simulator.onAuth(function(appId, pass) {
			assert.equal(appId, "app");
			assert.equal(pass, "pass");
		});
		
		var sender = appzone.sender("http://localhost:" + port, "app", "pass", 100);
		sender.sendSms("0721222333", message, function(err, status) {
			assert.equal(status.statusDescription, "SUCCESS");
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
		sender.sendSms("0721222333", "hello", function(err, status) {
			assert.ok(err);
			assert.ok(!status);
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
		sender.sendSms("0721222333", "hello", function(err, status) {
			assert.equal(status.statusCode, "SBL-SMS-MT-2000");
			simulator.close();
		});
	});
	
};

exports.testsSendMessageNoHost = function() {
	
	var sender = appzone.sender("http://localhost:3136", "app", "pass", 100);
	sender.sendSms("0721222333", "hello", function(status) {
		assert.equal(status.statusCode, "SBL-SMS-MT-2000");
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
		sender.broadcastSms("hello", function(err, status) {
			assert.equal(status.statusDescription, "SUCCESS");
			simulator.close();
		});
	});
	
};