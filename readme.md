NodeJs Client for Appzone
=========================

Appzone is the only Cloud Telco Platform in Srilanka which operates on Etisalt Srilanka.
This is 100% appzone compatible client library for NodeJs

Dependencies
------------
NodeJS 0.4 +
npm 0.3 +

Installation
------------
npm install appzone

Not Just Dump API
-----------------
Appzone for NodeJS is not a dump API which replicates the Appzone Core API but provides you a much cleaner interface to do what you wanted to do.
Message retries will be happen behind the seen and avoid most of the tedious works from you.

Usage
-----
### import the library
	var appzone = require('appzone');

### Sending
	var sender = appzone.sender('http://appzone-server', 'appId', 'password');

	//sendSms
	sender.sendSms('07223434', 'this is my message', function(err, resp) {
		//do what ever after message sent
	});

	//broadcastSms
	sender.broadcastSms('broadcast message');

	//sendUssd
	sender.sendUssd('address', 'conversationId', 'message');

	//sendUssdAndTerminate
	sender.sendUssdAndTerminate('address', 'conversationId', 'message');

### Receiving
	var receiver = appzone.receiver('8734') //any port you like

	//receive SMS
	receiver.onSms(function(sms) {
		//sample sms object
		//{address: "234343", message: "dscdfHh", correlator: "434", version: "1.0"}
	});

	//receive USSD
	receiver.onUssd(function(ussd) {
		//sample ussd object
		//{address: "234343", message: "dscdfHh", correlatationId: "434", conversationId: "343434394893", version: "1.0"}
	});

	//receive USSD termination
	receiver.onUssdTerminate(function(ussd) {
		//sample ussd object (this doesn't have the message)
		//{address: "234343", correlatationId: "434", conversationId: "343434394893", version: "1.0"}
	});