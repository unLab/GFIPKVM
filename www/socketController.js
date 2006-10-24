var controlCommand=0;
var keyMap = new Array();

keyMap = {
	'8':'42', // Backspace
	'9':'43', // Tab
	'13':'40', // Enter
	'16':'229', // Shift
	'17':'228', // Ctrl
	'18':'230', // Alt 
	'19':'72', // Pause
	'20':'57', // Caps Lock -- maybe 130/
	'27':'41', // Escape
	'33':'75', // Page Up
	'34':'78', // Page Down
	'35':'77', // End
	'36':'74', // Home
	'37':'80', // Left Arrow
	'38':'82', // Up Arrow
	'39':'79', // Right Arrow
	'40':'81', // Down Arrow
	'45':'73', // Insert
	'46':'76', // Delete
	'48':'39', // 0
	'49':'30', // 1
	'50':'31', // 2
	'51':'32', // 3
	'52':'33', // 4
	'53':'34', // 5
	'54':'35', // 6
	'55':'36', // 7
	'56':'37', // 8
	'57':'38', // 9
	'65':'4', // a
	'66':'5', // b
	'67':'6', // c
	'68':'7', // d
	'69':'8', // e
	'70':'9', // f
	'71':'10', // g
	'72':'11', // h
	'73':'12', // i
	'74':'13', // j
	'75':'14', // k
	'76':'15', // l
	'77':'16', // m
	'78':'17', // n
	'79':'18', // o
	'80':'19', // p
	'81':'20', // q
	'82':'21', // r
	'83':'22', // s
	'84':'23', // t
	'85':'24', // u
	'86':'25', // v
	'87':'26', // w
	'88':'27', // x
	'89':'28', // y
	'90':'29', // z
	'91':'227', // left window key (gui)
	'92':'231', // right window key (gui)
	'93':'119', // select key 
	'96':'98', // numpad 0
	'97':'89', // numpad 1
	'98':'90', // numpad 2
	'99':'91', // numpad 3
	'100':'92', // numpad 4
	'101':'93', // numpad 5
	'102':'94', // numpad 6
	'103':'95', // numpad 7 
	'104':'96', // numpad 8
	'105':'97', // numpad 9
	'106':'85', // multiply
	'107':'87', // add
	'109':'86', // substract
	'110':'99', // decimal point
	'111':'84', // divide
	'112':'58', // f1
	'113':'59', // f2
	'114':'60', // f3
	'115':'61', // f4
	'116':'62', // f5
	'117':'63', // f6
	'118':'64', // f7
	'119':'65', // f8
	'120':'66', // f9
	'121':'67', // f10
	'122':'68', // f11
	'123':'69', // f12
	'144':'83', // num lock
	'145':'71', // scroll lock
	'186':'51', // semi colon
	'187':'46', // equal sign
	'188':'54', // comma
	'189':'45', // dash
	'190':'55', // period
	'191':'56', // forward slash
	'192':'53', // grave accent (tick)
	'219':'47', // open bracket
	'220':'49', // back slash
	'221':'48', // close bracket
	'222':'52', // single quote
};



$(function () {
	"use strict";

	var status = $('#status');


	// if user is running mozilla then use it's built-in WebSocket
	window.WebSocket = window.WebSocket || window.MozWebSocket;

	// if browser doesn't support WebSocket, just show some notification and exit
	if (!window.WebSocket) {
		content.html($('<p>', { text: 'Sorry, but your browser doesn\'t support WebSockets.'} ));
		return;
	}

	// open connection
	var connection = new WebSocket('ws://192.168.2.220:1337');

	connection.onopen = function () {
		// first we want users to enter their names
		status.text('Connection Established.');
	};

	connection.onerror = function (error) {
		// just in there were some problems with conenction...
		content.html($('<p>', { text: 'Sorry, but there\'s some problem with your connection or the server is down.</p>' } ));
	};

	// most important part - incoming messages
	connection.onmessage = function (message) {
		status.text(message.data);
		return;
	}

	// This is used to send a message to the server...
	// connection.send(msg);

	


				// Check for control commands

				function sendCommand(cmd) {
					
					connection.send(cmd);
					controlCommand=0;
				}
				

				$('#ctrlaltdel').mouseup(function(e) {
					connection.send('0228');
					connection.send('0230');
					connection.send('0076');
					connection.send('1228');
					connection.send('1230');
					connection.send('1076');
					controlCommand=0;
				});

				$('#altf4').mouseup(function(e) {
					connection.send('0230');
					connection.send('0061');
					connection.send('1230');
					connection.send('1061');
					controlCommand=0;
				});

				$('#ctrlw').mouseup(function(e) {
					connection.send('0228');
					connection.send('0026');
					connection.send('1228');
					connection.send('1026');
					controlCommand=0;
				});
				$('#capslock').mouseup(function(e) {
					connection.send('0057');
					connection.send('1057');
					controlCommand=0;
				});

				$('#switch').mouseup(function(e) {
					connection.send('9101');
					controlCommand=0;
				});
				
				$('#comp1').mouseup(function(e) {
					connection.send('9201');
					controlCommand=0;
				});
				$('#comp2').mouseup(function(e) {
					connection.send('9202');
					controlCommand=0;
				});
				$('#comp3').mouseup(function(e) {
					connection.send('9203');
					controlCommand=0;
				});
				$('#comp4').mouseup(function(e) {
					connection.send('9204');
					controlCommand=0;
				});
				$('#wolcomp1').mouseup(function(e) {
					connection.send('9301');
					controlCommand=0;
				});
				$('#wolcomp2').mouseup(function(e) {
					connection.send('9302');
					controlCommand=0;
				});
				$('#wolcomp3').mouseup(function(e) {
					connection.send('9303');
					controlCommand=0;
				});
				$('#wolcomp4').mouseup(function(e) {
					connection.send('9304');
					controlCommand=0;
				});
				$('#reset').mouseup(function(e) {
					connection.send('9999');
					controlCommand=0;
				});
				







				// Key Down Press
				$(document.body).keydown(function (evt) {
					event.preventDefault();

					// evt.keyCode : is the key code.
					encode(keyMap[evt.keyCode], 1);
					document.getElementById('debug').innerHTML="<br>KEY DOWN\t"+evt.keyCode+document.getElementById('debug').innerHTML;
					
				});
				
				// Key Up Press
				$(document.body).keyup(function (evt) {

					// evt.keyCode : is the key code.
					encode(keyMap[evt.keyCode], 2);
					document.getElementById('debug').innerHTML="<br>KEY UP\t"+evt.keyCode+document.getElementById('debug').innerHTML;
				});

				// Mouse Down Press
				$('#canvas').mousedown(function(e) {

					var posX = $(this).offset().left, posY = $(this).offset().top;
					var realPosX = e.pageX - posX, realPosY = e.pageY - posY;
					var mouseButton;
					// Switch mouse button.
					switch (e.which) {
						case 1:
						    mouseButton='1';
						    break;
						case 2:
						    mouseButton='2';
						    break;
						case 3:
						    mouseButton='3';
						    break;
						default:
						    alert('You have a strange mouse');
					}

					// realPosX, realPosY, mouseButton
					encode(null, null, mouseButton, realPosX, realPosY, 1);
					document.getElementById('debug').innerHTML="<br>"+mouseButton+" MOUSE DOWN\t"+realPosX+"x"+realPosY+"y"+document.getElementById('debug').innerHTML;
					return false;
				});

				// Mouse Up Press
				$('#canvas').mouseup(function(e) {

					var posX = $(this).offset().left, posY = $(this).offset().top;
					var realPosX = e.pageX - posX, realPosY = e.pageY - posY;
					var mouseButton;
					// Switch mouse button.
					switch (e.which) {
						case 1:
						    mouseButton='1';
						    break;
						case 2:
						    mouseButton='2';
						    break;
						case 3:
						    mouseButton='3';
						    break;
						default:
						    alert('You have a strange mouse');
					}

					// realPosX, realPosY, mouseButton
					encode(null, null, mouseButton, realPosX, realPosY, 2);
					document.getElementById('debug').innerHTML="<br>"+mouseButton+" MOUSE UP\t"+realPosX+"x"+realPosY+"y"+document.getElementById('debug').innerHTML;
				});

				// Disable right click context menu.
				$(document).ready(function()
				{
				       $(document).bind("contextmenu",function(e){
					      return false;
				       });
				});
			

			var keyBuffer=[]; // Used to hold keys that are current in a pressed state.
			var mouseBuffer=[]; // [0]=>x [1]=>y - Used to hold the mouse key down coords, while we wait for mouse up.

			// This function takes key code and mouse events, and encodes it into an ASCII stream.
			function encode(
					jsKeyCode, /* Values: 8-222 */ 
					keyState, /* Values: 1 (DOWN), 2 (UP) */
					mouseButton, /* Values: 1 (Left), 2 (Middle), 3 (Right) */
					mouseX, /* Values: (1-800) */
					mouseY, /* Values: (1-600) */
					mouseState /* Values: 1 (DOWN), 2 (UP) */
					)
			{
				var treated;

				if (jsKeyCode!=null)
				{
					// Keyboard key was pressed.
					if (jsKeyCode<10)
					{
						treated='000'+jsKeyCode;
					}
					else if (jsKeyCode<100)
					{
						treated='00'+jsKeyCode;
					}
					else
					{
						treated='0'+jsKeyCode;
					}
					

					for (var inc in keyBuffer) {
						if (keyBuffer[inc] == ''+jsKeyCode) {
							// Key already exists.
							var inBuff=true;
					   	}
					}

					if (inBuff!=true)
					{
						connection.send(treated);
					}
					
					if (keyState==1)
					{
						keyBufferUpdate(jsKeyCode);
					}
					else
					{
						if (jsKeyCode<10)
						{
							treated='100'+jsKeyCode;
						}
						else if (jsKeyCode<100)
						{
							treated='10'+jsKeyCode;
						}
						else
						{
							treated='1'+jsKeyCode;
						}
						
						connection.send(treated);
						
						keyBufferUpdate(jsKeyCode, true);
					}
				}

				if (mouseButton!=null)
				{
					if (mouseX<10)
					{
						mouseX="00"+mouseX;
					}
					else if (mouseX<100)
					{
						mouseX="0"+mouseX;
					}
					
					if (mouseY<10)
					{
						mouseY="00"+mouseY;
					}
					else if (mouseY<100)
					{
						mouseY="0"+mouseY;
					}					

					if (mouseButton==1&&mouseState==1)
					{
						// Left mouse button down.
						var mouseByte=2+""+mouseX+2+""+mouseY;
						
					}
					if (mouseButton==1&&mouseState==2)
					{
						// Left mouse button up.
						var mouseByte=3+""+mouseX+3+""+mouseY;
					}
					
					if (mouseButton==2&&mouseState==1)
					{
						// Left mouse button down.
						var mouseByte=4+""+mouseX+4+""+mouseY;
						
					}
					if (mouseButton==2&&mouseState==2)
					{
						// Left mouse button up.
						var mouseByte=5+""+mouseX+5+""+mouseY;
					}

					if (mouseButton==3&&mouseState==1)
					{
						// Right mouse button down.
						var mouseByte=6+""+mouseX+6+""+mouseY;
					}
					if (mouseButton==3&&mouseState==2)
					{
						// Right mouse button up.
						var mouseByte=7+""+mouseX+7+""+mouseY;
					}
					
					connection.send(mouseByte);
				}
			}

			function keyBufferUpdate(jsKeyCode, clear)
			{
				var inBuff;
				// Check if key is already in the array.
				for (var inc in keyBuffer) {
					if (keyBuffer[inc] == ''+jsKeyCode) {
						// Key already exists, let's check and see if we want to clear it.
						if (clear==true)
						{
							// We want to clear it, so lets do that.
							keyBuffer.splice(inc, 1);
						}
						
						// In the buffer.
						inBuff=true;
				   	}
				}

				if (inBuff!=true&&clear!=true)
				{
					// We want to add this key press to the buffer, a new key has been pressed.
					keyBuffer[keyBuffer.length]=''+jsKeyCode;
				}

				writeBuffer();
			}
			
			function writeBuffer()
			{
				document.getElementById('current').innerHTML='';
				for (var inc in keyBuffer) {
					document.getElementById('current').innerHTML = document.getElementById('current').innerHTML+keyBuffer[inc]+'+';
				}
			}


			// Prevent window close.
			window.onbeforeunload = function() {
			    return 'Are you sure you want to close the IP KVM?  If you meant to close an application on the remote machine, please use one of the buttons in the left side panel.';
			}





















	/**
	* This method is optional. If the server wasn't able to respond to the
	* in 3 seconds then show some error message to notify the user that
	* something is wrong.
	*/
	setInterval(function() {
		if (connection.readyState !== 1) {
			status.text('Unable to comminucate with Server.');
		}
	}, 3000);
});
