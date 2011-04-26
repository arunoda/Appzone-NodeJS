var assert = require("assert");
var rest = require("restler");
var appzoneLib = require('../lib-cov/appzone');

exports.testsSendMessage = function() {
	
	require('../simulator/simulator.js').load(function afterStarted(simulator, port) {
		
		simulator.done();
		var smsMessage = {
				address: "0721234567",
				message: "hi",
				correlator: "10",
				version: "1.0"
			};
		var appzone = appzoneLib.load("http://localhost:" + port, "app", "pass", 100);
		
		var ctrl = appzone.receive(3113, function(sms) {
			assert.deepEqual(sms, smsMessage);
			ctrl.close();
		});
		
		
		setTimeout(function() {
			rest.post("http://localhost:3113", {
				data: smsMessage
			}).on("complete", function(data, response) {
				assert.equal(200, response.statusCode);
			}).on("error", function(err) {
				simulator.done();
				assert.fail(err);
			});
		}, 1000);
	});
	
};

exports.testsSendMessageInGet = function() {
	
	require('../simulator/simulator.js').load(function afterStarted(simulator, port) {
		
		simulator.done();
		var smsMessage = {
				address: "0721234567",
				message: "hi",
				correlator: "10",
				version: "1.0"
			};
		var appzone = appzoneLib.load("http://localhost:" + port, "app", "pass", 100);
		
		var ctrl = appzone.receive(3114, function(sms) {
			assert.deepEqual(sms, smsMessage);
		});
		
		
		setTimeout(function() {
			rest.get("http://localhost:3114").on("complete", function(data, response) {
				assert.equal(404, response.statusCode);
				ctrl.close();
			}).on("error", function(err) {
				
			});
		}, 1000);
	});
	
};

exports.testsSendMessageLessParamaters = function() {
	
	require('../simulator/simulator.js').load(function afterStarted(simulator, port) {
		
		simulator.done();
		var smsMessage = {
				address: "0721234567",
				message: "hi",
				correlator: "10",
				version: "1.0"
			};
		var appzone = appzoneLib.load("http://localhost:" + port, "app", "pass", 100);
		
		var ctrl = appzone.receive(3115, function(sms) {
			assert.deepEqual(sms, smsMessage);
		});
		
		
		setTimeout(function() {
			rest.post("http://localhost:3115", {
				data: {}
			}).on("complete", function(data, response) {
				assert.equal(404, response.statusCode);
				ctrl.close();
			}).on("error", function(err) {
			});
		}, 1000);
	});
	
};
