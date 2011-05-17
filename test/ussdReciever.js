var appzone = require('appzone');
var rest = require('restler');
var assert = require('assert');

exports.testsNormalMessage = function() {
	
	var port = 5006;
	var conversationId = '34343435';
	var correlationId = '98778767';
	var address = 'address1';
	var message = 'the message';
	
	var receiver = appzone.receiver(port);
	receiver.onUssd(function(msg) {
		assert.equal(address, msg.address);
		assert.equal(message, msg.message);
		assert.equal(correlationId, msg.correlationId);
		assert.equal(conversationId, msg.conversationId);
		assert.equal('1.0', msg.version);
		
		receiver.close();
	});
	
	var ussdMessage = {
			address: address,
			message: message,
			correlationId: correlationId
	};
	var url = 'http://localhost:' + port + '/ussd';
	sendMessage(url, 'X-USSD-Message', conversationId, ussdMessage);
	
};

exports.testsTerminateMessage = function() {
	
	var port = 5007;
	var conversationId = '34343435';
	var correlationId = '98778767';
	var address = 'address1';
	
	var receiver = appzone.receiver(port);
	receiver.onUssdTerminate(function(msg) {
		assert.equal(address, msg.address);
		assert.equal(correlationId, msg.correlationId);
		assert.equal(conversationId, msg.conversationId);
		assert.equal('1.0', msg.version);
		
		receiver.close();
	});
	
	var ussdMessage = {
			address: address,
			correlationId: correlationId
	};
	var url = 'http://localhost:' + port + '/ussd';
	sendMessage(url, 'X-USSD-Terminate-Message', conversationId, ussdMessage);
	
};

exports.testsAliveMessage = function() {
	
	var port = 5008;
	
	var receiver = appzone.receiver(port);
	
	setTimeout(function() {
		var headers = {};
		headers['X-Requested-Version'] = '1.0';
		headers['X-Message-type'] = 'X-USSD-Alive-Message';
		
		rest.post('http://localhost:' + port + '/ussd/', {
			headers: headers
			
		}).on("complete", function(data, response) {
			assert.equal(202, response.statusCode);
			receiver.close();
		}).on("error", function(err, err2) { console.error(err2); });
	}, 200);
	
};

exports.testsInvalidMessage = function() {
	
	var port = 5009;
	
	var receiver = appzone.receiver(port);
	
	setTimeout(function() {
		var headers = {};
		headers['X-Requested-Version'] = '1.0';
		headers['X-Message-type'] = 'X-USSD-cddf-Message';
		
		rest.post('http://localhost:' + port + '/ussd/', {
			headers: headers
			
		}).on("complete", function(data, response) {
			assert.equal(404, response.statusCode);
			receiver.close();
		}).on("error", function(err, err2) { console.error(err2); });
	}, 200);
	
};

function sendMessage(url, type, conversationId, body) {
	
	setTimeout(function() {
		
		var headers = {};
		headers['Content-Type'] = 'application/json';
		headers['X-Requested-Version'] = '1.0';
		headers['X-Requested-Encoding'] = 'UTF-8';
		headers['X-Message-type'] = type;
		headers['X-Requested-Conversation-ID'] = conversationId;
		
		rest.post(url, {
			headers: headers,
			data: JSON.stringify(body)
			
		}).on("complete", function() {}).on("error", function(err, err2) { console.error(err2); });
	}, 200);
}