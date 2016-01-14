/* Rotary encoder read example */
#define ENC_A 0
#define ENC_B 1
#define ENC_PORT PIND

#define BUT_A 3
#define BUT_B 4

// the following variables are long's because the time, measured in miliseconds,
// will quickly become a bigger number than can be stored in an int.
long lastDebounceTime = 0;  // the last time the output pin was toggled
long debounceDelay = 50;    // the debounce time; increase if the output flickers

 
void setup()
{
  /* Setup encoder pins as inputs */
  pinMode(ENC_A, INPUT);
  digitalWrite(ENC_A, HIGH);
  pinMode(ENC_B, INPUT);
  digitalWrite(ENC_B, HIGH);
  pinMode(BUT_B, INPUT);
//  digitalWrite(BUT_B, HIGH);
  pinMode(BUT_A, INPUT);
//  digitalWrite(BUT_A, HIGH);
  Serial.begin (115200);
  Serial.println("Start");
  Keyboard.begin();
}
 
void loop()
{
 static int8_t laststate = 0;      //this variable will be changed by encoder input
  
 int8_t tmpdata;
 /**/
  tmpdata = read_encoder();
  if( tmpdata ) {
//    Serial.print("Counter value: ");
//    Serial.println(tmpdata, DEC);
    if( tmpdata != laststate) {
      laststate = tmpdata;
//      Serial.println("step 1");
    } else if (tmpdata == laststate) {
//      Serial.println("step 2");
      if (laststate == 1) {
        Serial.println("Up");
        Keyboard.write(218);
      } else if (laststate == -1) {
        Serial.println("Down");
        Keyboard.write(217);
      }
      laststate = 0;
    }
  }


/* Primary Button Trigger */
  static uint8_t pribut = 1;

  // Variables will change:
  static int buttonState_A;             // the current reading from the input pin
  static int lastButtonReading_A = LOW;   // the previous reading from the input pin
  // read the state of the switch into a local variable:
  int reading_A = digitalRead(BUT_A);

  // check to see if you just pressed the button 
  // (i.e. the input went from LOW to HIGH),  and you've waited 
  // long enough since the last press to ignore any noise:  

  // If the switch changed, due to noise or pressing:
  if (reading_A != lastButtonReading_A) {
    // reset the debouncing timer
    lastDebounceTime = millis();
  } 
  
  if ((millis() - lastDebounceTime) > debounceDelay) {
    // whatever the reading is at, it's been there for longer
    // than the debounce delay, so take it as the actual current state:
    buttonState_A = reading_A;
  }
  
  // set the LED using the state of the button:
  if( buttonState_A == 0 && pribut == 1) {
    pribut = 0;
    Serial.println("Right");
    Keyboard.write(215);
  } else if ( buttonState_A == 1 && pribut == 0 ) {
    pribut = 1;
  }
  // save the reading.  Next time through the loop,
  // it'll be the lastButtonState:
  lastButtonReading_A = reading_A;

/* Secondary Button Trigger */
  static uint8_t secbut = 1;

  static int buttonState_B;             // the current reading from the input pin
  static int lastButtonReading_B = LOW;   // the previous reading from the input pin
  // read the state of the switch into a local variable:
  int reading_B = digitalRead(BUT_B);

  // check to see if you just pressed the button 
  // (i.e. the input went from LOW to HIGH),  and you've waited 
  // long enough since the last press to ignore any noise:  

  // If the switch changed, due to noise or pressing:
  if (reading_B != lastButtonReading_B) {
    // reset the debouncing timer
    lastDebounceTime = millis();
  } 
  
  if ((millis() - lastDebounceTime) > debounceDelay) {
    // whatever the reading is at, it's been there for longer
    // than the debounce delay, so take it as the actual current state:
    buttonState_B = reading_B;
  }
  
  // set the LED using the state of the button:
  if( buttonState_B == 0 && secbut == 1) {
    secbut = 0;
    Serial.println("Left");
    Keyboard.write(216);
  } else if ( buttonState_B == 1 && secbut == 0 ) {
    secbut = 1;
  }
  // save the reading.  Next time through the loop,
  // it'll be the lastButtonState:
  lastButtonReading_B = reading_B;

  //  digitalWrite(ledPin, buttonState);
//  if( digitalRead(BUT_A) == HIGH && pribut == 1) {
//    pribut = 0;
//    Serial.println("Right");
//  } else {
//    pribut = 1;
//  }
//  int8_t tmpsecbut = digitalRead(BUT_B);
//  Serial.println(tmpsecbut);

  
}
 
/* returns change in encoder state (-1,0,1) */
int8_t read_encoder()
{
  static int8_t enc_states[] = {0,-1,1,0,1,0,0,-1,-1,0,0,1,0,1,-1,0};
  static uint8_t old_AB = 0;
  /**/
  old_AB <<= 2;                   //remember previous state
  old_AB |= ( ENC_PORT & 0x03 );  //add current state
  return ( enc_states[( old_AB & 0x0f )]);
}
