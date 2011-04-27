/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['ussdSender.js']) {
  _$jscoverage['ussdSender.js'] = [];
  _$jscoverage['ussdSender.js'][27] = 0;
  _$jscoverage['ussdSender.js'][29] = 0;
  _$jscoverage['ussdSender.js'][31] = 0;
  _$jscoverage['ussdSender.js'][34] = 0;
  _$jscoverage['ussdSender.js'][36] = 0;
  _$jscoverage['ussdSender.js'][38] = 0;
  _$jscoverage['ussdSender.js'][39] = 0;
  _$jscoverage['ussdSender.js'][40] = 0;
  _$jscoverage['ussdSender.js'][41] = 0;
  _$jscoverage['ussdSender.js'][42] = 0;
  _$jscoverage['ussdSender.js'][44] = 0;
  _$jscoverage['ussdSender.js'][50] = 0;
  _$jscoverage['ussdSender.js'][52] = 0;
  _$jscoverage['ussdSender.js'][53] = 0;
  _$jscoverage['ussdSender.js'][55] = 0;
  _$jscoverage['ussdSender.js'][65] = 0;
  _$jscoverage['ussdSender.js'][67] = 0;
  _$jscoverage['ussdSender.js'][68] = 0;
  _$jscoverage['ussdSender.js'][70] = 0;
  _$jscoverage['ussdSender.js'][71] = 0;
  _$jscoverage['ussdSender.js'][73] = 0;
  _$jscoverage['ussdSender.js'][77] = 0;
  _$jscoverage['ussdSender.js'][79] = 0;
  _$jscoverage['ussdSender.js'][80] = 0;
  _$jscoverage['ussdSender.js'][87] = 0;
  _$jscoverage['ussdSender.js'][91] = 0;
  _$jscoverage['ussdSender.js'][93] = 0;
  _$jscoverage['ussdSender.js'][94] = 0;
  _$jscoverage['ussdSender.js'][98] = 0;
  _$jscoverage['ussdSender.js'][101] = 0;
  _$jscoverage['ussdSender.js'][102] = 0;
  _$jscoverage['ussdSender.js'][105] = 0;
  _$jscoverage['ussdSender.js'][106] = 0;
}
_$jscoverage['ussdSender.js'][27]++;
var rest = require("restler");
_$jscoverage['ussdSender.js'][29]++;
exports.load = (function (url, appId, password, retryInterval, retryLimit) {
  _$jscoverage['ussdSender.js'][31]++;
  return new UssdSender(url, appId, password, retryInterval, retryLimit);
});
_$jscoverage['ussdSender.js'][34]++;
function UssdSender(url, appId, password, retryInterval, retryLimit) {
  _$jscoverage['ussdSender.js'][36]++;
  var sendUssdMessage = (function (address, conversationId, message, terminate, callback) {
  _$jscoverage['ussdSender.js'][38]++;
  var headers = {};
  _$jscoverage['ussdSender.js'][39]++;
  headers["Content-Type"] = "application/json";
  _$jscoverage['ussdSender.js'][40]++;
  headers["X-Requested-Version"] = "1.0";
  _$jscoverage['ussdSender.js'][41]++;
  headers["X-Requested-Encoding"] = "UTF-8";
  _$jscoverage['ussdSender.js'][42]++;
  headers["X-Requested-Conversation-ID"] = "" + conversationId;
  _$jscoverage['ussdSender.js'][44]++;
  var body = {address: address, message: message, sessionTermination: "" + terminate};
  _$jscoverage['ussdSender.js'][50]++;
  function retrySendUssdMessage(address, conversationId, message, terminate, callback, tries) {
    _$jscoverage['ussdSender.js'][52]++;
    if (tries > retryLimit) {
      _$jscoverage['ussdSender.js'][53]++;
      console.error("Maximum retry limit of: " + retryLimit + " exeeded when requesing USSD message to: " + address);
    }
    else {
      _$jscoverage['ussdSender.js'][55]++;
      rest.post(url + "/ussd/", {headers: headers, data: JSON.stringify(body), usernamae: appId, password: password}).on("complete", onUssdAttemptCompleted).on("error", onErrorFired);
    }
}
  _$jscoverage['ussdSender.js'][65]++;
  function onUssdAttemptCompleted(data, response) {
    _$jscoverage['ussdSender.js'][67]++;
    if (response.statusCode == 200) {
      _$jscoverage['ussdSender.js'][68]++;
      status = JSON.parse(data);
      _$jscoverage['ussdSender.js'][70]++;
      if (status.statusCode == "SBL-USSD-2000") {
        _$jscoverage['ussdSender.js'][71]++;
        if (callback) {
          _$jscoverage['ussdSender.js'][71]++;
          callback(null, status);
        }
      }
      else {
        _$jscoverage['ussdSender.js'][73]++;
        retrySendUssdMessage(address, conversationId, message, terminate, callback, tries + 1);
      }
      _$jscoverage['ussdSender.js'][77]++;
      console.info("USSD message send to address: " + address);
    }
    else {
      _$jscoverage['ussdSender.js'][79]++;
      console.error("Appzone USSD message sending failed with statusCode: " + response.statusCode);
      _$jscoverage['ussdSender.js'][80]++;
      var err = {error: "Maximum retry limit of " + retryLimit + " exceeded when sending the ussd message", address: address, message: message, conversationId: conversationId};
      _$jscoverage['ussdSender.js'][87]++;
      if (callback) {
        _$jscoverage['ussdSender.js'][87]++;
        callback(err, null);
      }
    }
}
  _$jscoverage['ussdSender.js'][91]++;
  function onErrorFired(obj, err) {
    _$jscoverage['ussdSender.js'][93]++;
    console.error("Something wrong with the appzone host:" + url + " with error: " + JSON.stringify(err));
    _$jscoverage['ussdSender.js'][94]++;
    if (callback) {
      _$jscoverage['ussdSender.js'][94]++;
      callback(err, null);
    }
}
  _$jscoverage['ussdSender.js'][98]++;
  retrySendUssdMessage(address, conversationId, message, terminate, callback, 1);
});
  _$jscoverage['ussdSender.js'][101]++;
  this.sendUssd = (function (address, conversationId, message, callback) {
  _$jscoverage['ussdSender.js'][102]++;
  sendUssdMessage(address, conversationId, message, false, callback);
});
  _$jscoverage['ussdSender.js'][105]++;
  this.sendUssdAndTerminate = (function (address, conversationId, message, callback) {
  _$jscoverage['ussdSender.js'][106]++;
  sendUssdMessage(address, conversationId, message, true, callback);
});
}
_$jscoverage['ussdSender.js'].source = ["/**","","\tThe MIT License","\t","\tCopyright (c) 2011 Arunoda Susiripala","\t","\tPermission is hereby granted, free of charge, to any person obtaining a copy","\tof this software and associated documentation files (the \"Software\"), to deal","\tin the Software without restriction, including without limitation the rights","\tto use, copy, modify, merge, publish, distribute, sublicense, and/or sell","\tcopies of the Software, and to permit persons to whom the Software is","\tfurnished to do so, subject to the following conditions:","\t","\tThe above copyright notice and this permission notice shall be included in","\tall copies or substantial portions of the Software.","\t","\tTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR","\tIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,","\tFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE","\tAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER","\tLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,","\tOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN","\tTHE SOFTWARE.",""," */","","var rest = require('restler');","","exports.load = function(url, appId, password, retryInterval, retryLimit) {","\t","\treturn new UssdSender(url, appId, password, retryInterval, retryLimit);","};","","function UssdSender(url, appId, password, retryInterval, retryLimit) {","\t","\tvar sendUssdMessage = function(address, conversationId, message, terminate, callback) {","\t\t","\t\tvar headers = {};","\t\theaders['Content-Type'] = 'application/json';","\t\theaders['X-Requested-Version'] = '1.0';","\t\theaders['X-Requested-Encoding'] = 'UTF-8';","\t\theaders['X-Requested-Conversation-ID'] = '' + conversationId;","\t\t","\t\tvar body = {","\t\t\taddress: address,","\t\t\tmessage: message,","\t\t\tsessionTermination: '' + terminate","\t\t};","\t\t","\t\tfunction retrySendUssdMessage(address, conversationId, message, terminate, callback, tries) {","\t\t\t","\t\t\tif(tries &gt; retryLimit) {","\t\t\t\tconsole.error(\"Maximum retry limit of: \" + retryLimit + ' exeeded when requesing USSD message to: ' + address);","\t\t\t} else {","\t\t\t\trest.post(url + '/ussd/', {","\t\t\t\t\theaders: headers,","\t\t\t\t\tdata: JSON.stringify(body),","\t\t\t\t\tusernamae: appId,","\t\t\t\t\tpassword: password","\t\t\t\t\t","\t\t\t\t}).on(\"complete\", onUssdAttemptCompleted).on(\"error\", onErrorFired);","\t\t\t}","\t\t}","\t\t","\t\tfunction onUssdAttemptCompleted(data, response) {","\t\t\t","\t\t\tif(response.statusCode == 200) {","\t\t\t\tstatus = JSON.parse(data);","\t\t\t\t","\t\t\t\tif(status.statusCode == 'SBL-USSD-2000') {","\t\t\t\t\tif(callback) callback(null, status);","\t\t\t\t} else {","\t\t\t\t\tretrySendUssdMessage(address, conversationId, message, terminate, callback, tries + 1);","\t\t\t\t}","\t\t\t\t","\t\t\t\t","\t\t\t\tconsole.info(\"USSD message send to address: \" + address);","\t\t\t} else {","\t\t\t\tconsole.error(\"Appzone USSD message sending failed with statusCode: \" + response.statusCode);","\t\t\t\tvar err = {","\t\t\t\t\t\terror: \"Maximum retry limit of \" + retryLimit + \" exceeded when sending the ussd message\",","\t\t\t\t\t\taddress: address,","\t\t\t\t\t\tmessage: message,","\t\t\t\t\t\tconversationId: conversationId","\t\t\t\t\t};","\t\t\t\t\t","\t\t\t\tif(callback) callback(err, null);","\t\t\t}","\t\t}","\t\t","\t\tfunction onErrorFired(obj, err) {","\t\t\t","\t\t\tconsole.error(\"Something wrong with the appzone host:\" + url + \" with error: \" + JSON.stringify(err));","\t\t\tif(callback) callback(err, null);","\t\t}","\t\t","\t\t//Start retry process","\t\tretrySendUssdMessage(address, conversationId, message, terminate, callback, 1);","\t};","\t","\tthis.sendUssd = function(address, conversationId, message, callback) {","\t\tsendUssdMessage(address, conversationId, message, false, callback);","\t};","\t","\tthis.sendUssdAndTerminate = function(address, conversationId, message, callback) {","\t\tsendUssdMessage(address, conversationId, message, true, callback);","\t};","\t","}"];
