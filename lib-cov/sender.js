/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['sender.js']) {
  _$jscoverage['sender.js'] = [];
  _$jscoverage['sender.js'][27] = 0;
  _$jscoverage['sender.js'][28] = 0;
  _$jscoverage['sender.js'][30] = 0;
  _$jscoverage['sender.js'][31] = 0;
  _$jscoverage['sender.js'][34] = 0;
  _$jscoverage['sender.js'][36] = 0;
  _$jscoverage['sender.js'][37] = 0;
  _$jscoverage['sender.js'][39] = 0;
  _$jscoverage['sender.js'][40] = 0;
  _$jscoverage['sender.js'][43] = 0;
  _$jscoverage['sender.js'][44] = 0;
  _$jscoverage['sender.js'][47] = 0;
  _$jscoverage['sender.js'][51] = 0;
  _$jscoverage['sender.js'][53] = 0;
  _$jscoverage['sender.js'][57] = 0;
  _$jscoverage['sender.js'][58] = 0;
  _$jscoverage['sender.js'][60] = 0;
  _$jscoverage['sender.js'][62] = 0;
  _$jscoverage['sender.js'][63] = 0;
  _$jscoverage['sender.js'][64] = 0;
  _$jscoverage['sender.js'][65] = 0;
  _$jscoverage['sender.js'][68] = 0;
  _$jscoverage['sender.js'][75] = 0;
  _$jscoverage['sender.js'][77] = 0;
  _$jscoverage['sender.js'][87] = 0;
  _$jscoverage['sender.js'][88] = 0;
  _$jscoverage['sender.js'][89] = 0;
  _$jscoverage['sender.js'][91] = 0;
  _$jscoverage['sender.js'][93] = 0;
  _$jscoverage['sender.js'][94] = 0;
  _$jscoverage['sender.js'][97] = 0;
  _$jscoverage['sender.js'][98] = 0;
  _$jscoverage['sender.js'][99] = 0;
  _$jscoverage['sender.js'][103] = 0;
  _$jscoverage['sender.js'][104] = 0;
  _$jscoverage['sender.js'][105] = 0;
  _$jscoverage['sender.js'][106] = 0;
  _$jscoverage['sender.js'][108] = 0;
}
_$jscoverage['sender.js'][27]++;
var rest = require("restler");
_$jscoverage['sender.js'][28]++;
var xml2js = require("xml2js-expat");
_$jscoverage['sender.js'][30]++;
exports.load = (function (url, appId, password, retryInterval, retryLimit) {
  _$jscoverage['sender.js'][31]++;
  return new Sender(url, appId, password, retryInterval, retryLimit);
});
_$jscoverage['sender.js'][34]++;
function Sender(url, appId, password, retryInterval, retryLimit) {
  _$jscoverage['sender.js'][36]++;
  retryInterval = retryInterval? retryInterval: 30000;
  _$jscoverage['sender.js'][37]++;
  retryLimit = retryLimit? retryLimit: 5;
  _$jscoverage['sender.js'][39]++;
  this.sendSms = (function (address, message, callback) {
  _$jscoverage['sender.js'][40]++;
  sendMessageRetry("tel:" + address, message, callback, 1);
});
  _$jscoverage['sender.js'][43]++;
  this.broadcastSms = (function (message, callback) {
  _$jscoverage['sender.js'][44]++;
  sendMessageRetry("list:registered", message, callback, 1);
});
  _$jscoverage['sender.js'][47]++;
  this.sendUssd = (function (address, conversationId, message, callback) {
});
  _$jscoverage['sender.js'][51]++;
  var sendMessageRetry = (function (address, message, callback, count) {
  _$jscoverage['sender.js'][53]++;
  var retryCodes = ["SBL-SMS-MT-5000", "SBL-SMS-MT-5008", "SBL-SMS-MT-5001", "SBL-SMS-MT-5004", "CORE-SMS-MT-4049", "CORE-SMS-MT-4030", "CORE-SMS-MT-4016"];
  _$jscoverage['sender.js'][57]++;
  if (count > retryLimit) {
    _$jscoverage['sender.js'][58]++;
    console.error("maximum retry limit exeeded when sending message to: " + url + " for:" + address);
  }
  else {
    _$jscoverage['sender.js'][60]++;
    sendMessageLogic(address, message, (function (status) {
  _$jscoverage['sender.js'][62]++;
  if (! status || retryCodes.contains(status.status_code)) {
    _$jscoverage['sender.js'][63]++;
    console.log("retrying for: " + count + " of message: " + message + " to address:" + address);
    _$jscoverage['sender.js'][64]++;
    setTimeout((function () {
  _$jscoverage['sender.js'][65]++;
  sendMessageRetry(address, message, callback, count + 1);
}), retryInterval);
  }
  else {
    _$jscoverage['sender.js'][68]++;
    if (callback) {
      _$jscoverage['sender.js'][68]++;
      callback(status);
    }
  }
}));
  }
});
  _$jscoverage['sender.js'][75]++;
  var sendMessageLogic = (function (address, message, callback) {
  _$jscoverage['sender.js'][77]++;
  rest.post(url, {username: appId, password: password, data: {version: "1.0", address: address, message: message}}).on("complete", (function (data, response) {
  _$jscoverage['sender.js'][87]++;
  if (response.statusCode == 200) {
    _$jscoverage['sender.js'][88]++;
    var pasedData = parseXML(data, (function (status) {
  _$jscoverage['sender.js'][89]++;
  if (callback) {
    _$jscoverage['sender.js'][89]++;
    callback(status);
  }
}));
    _$jscoverage['sender.js'][91]++;
    console.info("message send to address: " + address);
  }
  else {
    _$jscoverage['sender.js'][93]++;
    console.error("Appzone Sending message failed with statusCode: " + response.statusCode);
    _$jscoverage['sender.js'][94]++;
    if (callback) {
      _$jscoverage['sender.js'][94]++;
      callback(null);
    }
  }
})).on("error", (function (err, err2) {
  _$jscoverage['sender.js'][97]++;
  console.error("Something wrong with the appzone host:" + url);
  _$jscoverage['sender.js'][98]++;
  console.error(err);
  _$jscoverage['sender.js'][99]++;
  console.error(err2);
}));
});
  _$jscoverage['sender.js'][103]++;
  var parseXML = (function (data, callback) {
  _$jscoverage['sender.js'][104]++;
  var p = new xml2js.Parser();
  _$jscoverage['sender.js'][105]++;
  p.addListener("end", (function (obj) {
  _$jscoverage['sender.js'][106]++;
  callback(obj);
}));
  _$jscoverage['sender.js'][108]++;
  p.parseString(data);
});
}
_$jscoverage['sender.js'].source = ["/**","","\tThe MIT License","\t","\tCopyright (c) 2011 Arunoda Susiripala","\t","\tPermission is hereby granted, free of charge, to any person obtaining a copy","\tof this software and associated documentation files (the \"Software\"), to deal","\tin the Software without restriction, including without limitation the rights","\tto use, copy, modify, merge, publish, distribute, sublicense, and/or sell","\tcopies of the Software, and to permit persons to whom the Software is","\tfurnished to do so, subject to the following conditions:","\t","\tThe above copyright notice and this permission notice shall be included in","\tall copies or substantial portions of the Software.","\t","\tTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR","\tIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,","\tFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE","\tAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER","\tLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,","\tOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN","\tTHE SOFTWARE.",""," */","","var rest = require(\"restler\");","var xml2js = require(\"xml2js-expat\");","","exports.load = function(url, appId, password, retryInterval, retryLimit) {","\treturn new Sender(url, appId, password, retryInterval, retryLimit);","};","","function Sender(url, appId, password, retryInterval, retryLimit) {","\t","\tretryInterval = (retryInterval)? retryInterval: 30000;","\tretryLimit = (retryLimit)? retryLimit: 5;","\t","\tthis.sendSms = function(address, message, callback) {","\t\tsendMessageRetry(\"tel:\" + address, message, callback, 1);","\t};","\t","\tthis.broadcastSms = function(message, callback) {","\t\tsendMessageRetry(\"list:registered\", message, callback, 1);","\t};","\t","\tthis.sendUssd = function(address, conversationId, message, callback) {","\t\t","\t};","\t","\tvar sendMessageRetry = function(address, message, callback, count) {","\t\t","\t\tvar retryCodes = [\"SBL-SMS-MT-5000\", \"SBL-SMS-MT-5008\", \"SBL-SMS-MT-5001\",","\t\t  \t\t\t\t\"SBL-SMS-MT-5004\", \"CORE-SMS-MT-4049\", \"CORE-SMS-MT-4030\", ","\t\t  \t\t\t\t\"CORE-SMS-MT-4016\"];","\t\t","\t\tif(count&gt; retryLimit) {","\t\t\tconsole.error(\"maximum retry limit exeeded when sending message to: \" + url + \" for:\" + address);","\t\t} else {","\t\t\tsendMessageLogic(address, message, function(status) {","\t\t\t\t","\t\t\t\tif(!status || retryCodes.contains(status.status_code)) {","\t\t\t\t\tconsole.log(\"retrying for: \" + count + \" of message: \" + message + \" to address:\" + address);","\t\t\t\t\tsetTimeout(function() {","\t\t\t\t\t\tsendMessageRetry(address, message, callback, count + 1);","\t\t\t\t\t}, retryInterval);","\t\t\t\t} else {","\t\t\t\t\tif(callback) callback(status);","\t\t\t\t}","\t\t\t});","\t\t}","\t\t","\t};","\t","\tvar sendMessageLogic = function(address, message, callback) {","","\t\trest.post(url, {","\t\t\tusername: appId,","\t\t\tpassword: password,","\t\t\tdata: {","\t\t\t\tversion: \"1.0\",","\t\t\t\taddress: address,","\t\t\t\tmessage: message","\t\t\t}","\t\t}).on(\"complete\", function(data, response) {","\t\t\t","\t\t\tif(response.statusCode == 200) {","\t\t\t\tvar pasedData = parseXML(data, function(status) {","\t\t\t\t\tif(callback) callback(status);","\t\t\t\t});","\t\t\t\tconsole.info(\"message send to address: \" + address);","\t\t\t} else {","\t\t\t\tconsole.error(\"Appzone Sending message failed with statusCode: \" + response.statusCode);","\t\t\t\tif(callback) callback(null);","\t\t\t}","\t\t}).on(\"error\", function(err, err2) {","\t\t\tconsole.error(\"Something wrong with the appzone host:\" + url);","\t\t\tconsole.error(err);","\t\t\tconsole.error(err2);","\t\t});","\t};","\t","\tvar parseXML = function(data, callback) {","\t\tvar p = new xml2js.Parser();","\t\tp.addListener(\"end\", function(obj) {","\t\t\tcallback(obj);","\t\t});","\t\tp.parseString(data);","\t};","}"];