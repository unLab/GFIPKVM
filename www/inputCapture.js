$(function(){

				// Key Down Press
				$(document.body).keydown(function (evt) {
					event.preventDefault();

					// evt.keyCode : is the key code.
					encode(evt.keyCode, 1);
					document.getElementById('debug').innerHTML="<br>KEY DOWN\t"+evt.keyCode+document.getElementById('debug').innerHTML;
					
				});
				
				// Key Up Press
				$(document.body).keyup(function (evt) {

					// evt.keyCode : is the key code.
					encode(evt.keyCode, 2);
					document.getElementById('debug').innerHTML="<br>KEY UP\t"+evt.keyCode+document.getElementById('debug').innerHTML;
				});

				// Mouse Down Press
				$('#canvas').mousedown(function(e) {

					var posX = $(this).offset().left, posY = $(this).offset().top;
					var realPosX = e.pageX - posX, realPosY = e.pageY - posY;

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

					if (mouseButton==3&&mouseState==1)
					{
						// Right mouse button down.
						var mouseByte=4+""+mouseX+4+""+mouseY;
					}
					if (mouseButton==3&&mouseState==2)
					{
						// Right mouse button up.
						var mouseByte=5+""+mouseX+5+""+mouseY;
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
