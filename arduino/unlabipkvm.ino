/*
  UnLab IPKVM Arduino Control Software
  Date: July 8th 2013
  Code by Aaron Brighton (aaron@aaronbrighton.ca) [DontGotNoProxy]

  This sketch makes use of the USB Keyboard HID firmware at the below link being flashed onto the USB 
  interface of the Arduino Uno allowing it to emulate a keyboard.

  http://dl.dropbox.com/u/1816557/Arduino-keyboard-0.3.hex

  To understand the this sketch's functionality one needs to familiarize them selves with the USB HID 
  spec as it relates to Keyboard reports, the following link is $

  http://www.usb.org/developers/devclass_docs/Hut1_11.pdf

  This sketch makes use of Software Serial, and uses pins 7 RX and 8 TX for serial communication with 
  a computer, this largely input medium is used by the arduino t$

  http://arduino.cc/en/Reference/SoftwareSerial

  To communicate with this sketch from the computer over softSerial you need to pass it reports in 
  the followinf format:

  -000-000-000-000-000-000-000-000-

  ex of the letter e followed by f

  -000-000-008-000-000-000-000-000--000-000-009-000-000-000-000-000-
*/

#include <SoftwareSerial.h>

// Pin 7 RX, Pin 8 TX
SoftwareSerial softSerial(7, 8);

int i = 0;
char serialIn=' ';
char cue[3];
int divTracker=0;

// Keyboard report buffer
uint8_t buf[8] = { 0 };

void setup()
{
  // Initiate the USB HID connection to the Keyboard (it behaves like a serial connection).
  Serial.begin(9600);
  
  // Initiate soft serial connection to the communicate which will be sending us commands, and keypresses.
  softSerial.begin(19200);
  
  // Setup the control pin for the KVM, for switching.
  pinMode(13, OUTPUT); 
}

void loop()
{
  /********************************
  ** NOTE TO SAVE YOU TIME AND HEADACHE

  softSerial.available()
    This function returns true for eternity after the first sign of action on the serial connection 
    from program start (when data is sent from the computer to the ardu$

  softSerial.read()
    This function returns true & the data in individual bytes off the serial connection, once a byte 
    has been read, the function will then proceed to return false with$

  *********************************/
  
  // Loop infinitely after first HID report from command server.
  while(softSerial.available() > 0)
  {
    // Read the newest character off the software serial.
    serialIn = softSerial.read();
    
    // A new byte has been read let's process it.
    if (serialIn)
    { 
      // This character is a "-", and because our divTracker is = 0, this must be the start of a HID report.
      if (serialIn == '-' && divTracker == 0)
      { 
        // Set our tracker to 1.
        divTracker=1;
      }
      // This character is not a divier ("-"), and our divTracker has started, so this must be a data byte,
      // let's cue it up to be added to the keyboard buffer.
      else if (serialIn != '-' && divTracker != 0)
      {
        // Add to our 3 byte cue, at the position of i, which is a counter that counts to 3, 
        //for each section of the report.
        cue[i]=serialIn; 
         
        // Increment our cue counter.
        i++; 
      }
      // This is a divider, and our tracker is not at 0 so we are in the middle of a report,
      // we need to dump our cue into it's appropriate HID report section, and$
      else if (serialIn == '-' && divTracker != 0)
      { 
        // Convert out char cue, into an int, and place it in the respective section of our HID buffer.
        buf[divTracker-1] = atoi(cue);

        // Increment our div counter, to progress threw the report.
        divTracker++;
        
        // Reset our cue counter, so we can build a new cue for the next section.
        i=0;
        // ^
        cue[0]='0';
        // ^^
        cue[1]='0';
        // ^^^
        cue[2]='0';
      }
      if (divTracker == 9)
      {
        // Our report is done, let's now process it, and determine whether it is a 
        // keypress that needs to get sent our the HID Keyboard interface, or a control comm$
        if (buf[1] != 0)
        {
          // This is a control command, let's carry out a control action.
          if (buf[1] == 100)
          {
            // Switch the KVM.

            // Send high voltage to the KVM, to activate the switch.
            digitalWrite(13, HIGH);
            
            // Wait 250 ms for it switch.
            delay(250);
              
            // Remove the voltage now that the KVM has switched.
            digitalWrite(13, LOW);
          }
        }
        else
        {
          // This is a keypress let's send the HID report out our Keyboard 
          // for the KVM / end computer to handle.
          
          // Send keypress
          Serial.write(buf, 8);
               
          // Release the press.
          releaseKey();
        }

        // Time to reset everything and wait for a new report.
        divTracker=0;
      
      // If divTracker
      } 
    // If serialIn  
    }
  // While Loop
  }
// Void Loop  
}

// Releases our processed key press.
void releaseKey()
{
  buf[0] = 0;
  buf[2] = 0;
  
  // Release key
  Serial.write(buf, 8);
}
