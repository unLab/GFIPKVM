// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-kvm';

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
var url = require("url");
var path = require("path");
var fs = require("fs");
var port = 80;

/*
* Global variables
*/

// latest 100 messages
var history = [ ];

// list of currently connected clients (users)
var clients = [ ];

/**
* HTTP server
*/
var server = http.createServer(function(request, response) {

});

server.listen(webSocketsServerPort, function() {
	console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

 
/**
* WebSocket server
*/
var wsServer = new webSocketServer({
	// WebSocket server is tied to a HTTP server. WebSocket request is just
	// an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
	httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {

	console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

	// accept connection - you should check 'request.origin' to make sure that
	// client is connecting from your website
	// (http://en.wikipedia.org/wiki/Same_origin_policy)
	var connection = request.accept(null, request.origin);
	
	
	// Connection started from Browser Client, we should also start the serial connection
	var SerialPort, port, serial, _this = this;

	SerialPort = require('serialport').SerialPort;
	port = '/dev/ttyUSB0';

	serial = null;
	
	serial = new SerialPort(port, {
  		baudrate: 9600
	});
	
	serial.on("open", function () {
	  console.log('open');
	  serial.on('data', function(data) {
	    console.log('data received: ' + data);
	  });  
	  serial.write('004', function(err, results) {
	    console.log('err ' + err);
	    console.log('results ' + results);
	  });  
	});

	// we need to know client index to remove them on 'close' event
	var index = clients.push(connection) - 1;
	console.log((new Date()) + ' Connection accepted.');
	 

	// user sent some message


	connection.on('message', function(message) {

		// message.type - should be utf8
		// message.utf8Data - should be the raw message.
		if (message.type === 'utf8') { // accept only text
		

		// Write whatever the fuck they said.

		//what is a? 004? ... 00004
			serial.write(message.utf8Data.substr(1));
			//if (message.utf8Data == '0004')
			//{
				// a has been pressed, let's convert to HID code, and send it.
			//	serial.write(new Buffer([0x01]));
			//	console.log("ON");
			//}

			//if (message.utf8Data == '0005')
                        //{
                                // a has been pressed, let's convert to HID code, and send it.
                        //        serial.write(new Buffer([0x00]));
			//	console.log("OFF");
                        //}
			
			// Interpret the message.
			console.log('Wrote: '+message.utf8Data.substr(1));

		}
	});

});

