var assert = require("assert");
var rest = require("restler");
var appzone = require('../lib-cov/appzone');

exports.testsSendMessage = function() {
	
	var smsMessage = {
			address: "0721234567",
			message: "hi",
			correlator: "10",
			version: "1.0"
		};
	
	var receiver = appzone.receiver(3113);
	receiver.onSms(function(sms) {
		assert.deepEqual(sms, smsMessage);
		receiver.close();
	});
	
	setTimeout(function() {
		rest.post("http://localhost:3113", {
			data: smsMessage
		}).on("complete", function(data, response) {
			assert.equal(200, response.statusCode);
		}).on("error", function(err) {
			assert.fail(err);
		});
	}, 1000);
	
};

exports.testsSendMessageInGet = function() {
	
	var smsMessage = {
			address: "0721234567",
			message: "hi",
			correlator: "10",
			version: "1.0"
		};
	
	var receiver = appzone.receiver(3114);
	receiver.onSms(function(sms) {
		assert.deepEqual(sms, smsMessage);
	});
	
	setTimeout(function() {
		rest.get("http://localhost:3114", {
			data: smsMessage
		}).on("complete", function(data, response) {
			receiver.close();
			assert.equal(404, response.statusCode);
		}).on("error", function(err) {
		});
	}, 1000);
	
};

exports.testsSendMessageLessParamaters = function() {
	
	var smsMessage = {
			address: "0721234567",
			message: "hi",
			correlator: "10"
		};
	
	var receiver = appzone.receiver(3115);
	receiver.onSms(function(sms) {
		assert.deepEqual(sms, smsMessage);
		receiver.close();
	});
	
	setTimeout(function() {
		rest.post("http://localhost:3115", {
			data: smsMessage
		}).on("complete", function(data, response) {
			receiver.close();
			assert.equal(404, response.statusCode);
		}).on("error", function(err) {
		});
	}, 1000);
	
};
