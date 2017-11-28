
function init(){
    cpu_history = {
        user: [],
        kernel: [],
        total: [],
        last_user: [],
        last_kernel: [],
        last_total: []
    };
    mem_history = {
        used: []
    };
    console.log(chrome);
    debugger;
}
init();

function getSerialLoop() {

}

function getSerial() {

}

function connectToSerial(path) {
  chrome.serial.connect(path, {bitrate: 9600}, onConnectedCb);
}

function onConnectedCb (connectionInfo) {
   // 串行端口已打开，保存其标识符以便以后使用。
  // _this.connectionId = connectionInfo.connectionId;
  if (connectionInfo && connectionInfo.connectionId) {
    hasConnectedWeightSerial = true
    scalesListener()
  }
  console.log(connectionInfo)
  // 对已打开的端口做任何您需要做的事情。
}

var onReceiveCallback = function(info) {
    if (info.connectionId && info.data) {
      // arrayBufferToString(info.data, 'UTF-8', function(res) {
      //   console.log(res)
      // }); //"ABC"
      var str = convertArrayBufferToString(info.data);
      if (str.charAt(str.length-1) === '\n') {
        stringReceived += str.substring(0, str.length-1);
        onLineReceived(stringReceived);
        stringReceived = '';
      } else {
        stringReceived += str;
      }
      console.log(stringReceived);
      chrome.runtime.sendMessage("idOfYourAppHere", 'sending message' + stringReceived, function(response) {
        console.log('idOfYourAppHere recive', response)
        /* ... */
      });
    }
  };


function scalesListener() {
  chrome.serial.onReceive.addListener(onReceiveCallback);
}

var hasGetWeightSerial = false;
var hasConnectedWeightSerial = false;
var stringReceived = '';

var onGetDevices = function(ports) {
  for (var i=0; i<ports.length; i++) {
    if (!hasGetWeightSerial && ports[i].path.indexOf('HX170080') > 0) {
      connectToSerial(ports[i].path)
    }
    console.log(ports[i].path);
  }
}




// var tempSetInterval =

var tempSetInterval = setInterval(function() {
  chrome.serial.getDevices(onGetDevices);
//   var options = {
//     vendorId: 0x05ac,  //Apple, Inc.
//     productId: 0x12a0  //iPhone 4s
// };
//   chrome.usb.getDevices({}, function(deviceArray){
//       //do something with deviceArray;
//       console.log('deviceArr', deviceArray)
//   });
}, 1000)

setTimeout(function() {
  clearInterval(tempSetInterval)
}, 10000)

// chrome.runtime.onConnectExternal.addListener(function(port) {
//   console.assert(port.name == "knockknock");
//   port.onMessage.addListener(function(msg) {
//     console.log('njacjbdpdplnbemlfhgdfgmgjmillikm', msg)
//     if (msg.joke == "Knock knock")
//       port.postMessage({question: "Who's there?"});
//     else if (msg.answer == "Madame")
//       port.postMessage({question: "Madame who?"});
//     else if (msg.answer == "Madame... Bovary")
//       port.postMessage({question: "I don't get it."});
//   });
// });



function arrayBufferToString( buffer, encoding, callback ) {
    var blob = new Blob([buffer],{type:'text/plain'});
    var reader = new FileReader();
    reader.onload = function(evt){callback(evt.target.result);};
    reader.readAsText(blob, encoding);
}

function convertArrayBufferToString(buf){
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(encodedString);
}
