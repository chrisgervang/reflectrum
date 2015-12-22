// To measure position, the sense line must be connected to a
// pin capable of reading analog voltages.  For pressure,
// the sense line and drive line 2 must be connected to pins
// capable of reading analog voltages.  See the FSLP guide for
// more information.
#include <Mouse.h>

//const int fslpSenseLine = 16; // Analog
//const int fslpDriveLine1 = 11;
//const int fslpDriveLine2 = 10; // Change to analog for testing..
//const int fslpBotR0 = 9;

const int fslpSenseLine = A2; // Analog
const int fslpDriveLine1 = 11;
const int fslpDriveLine2 = 10; // Change to analog for testing..
const int fslpBotR0 = 9;

void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600);
  delay(250);
}
// pin numbers are 1, 2, 3 left to right, where 3 is closest to the NC pin 4.
// 2.86v (~880 count) is sensed when finger is pressing on the (top) side closest to the wires.
// 1.68v (~520 count) is sensed when finger is pressing on the opposite (bottom) side.
// 3.29v (1023 count) is sensed when no finger is pressed.
void loop() {
  // put your main code here, to run repeatedly:
//  delay(500);
//  Serial.println(fslpGetPosition());
//  delay(250);
//  Serial.println(fslpGetPressure());

  int p1 = fslpGetPosition();
  for (int i = 0; i < 10; i++) {
    p1 -= p1 / i;
    p1 += fslpGetPosition() / i;
    delay(2);
  }
  int p2 = fslpGetPosition();
  for (int i = 0; i < 10; i++) {
    p2 -= p2 / i;
    p2 += fslpGetPosition() / i;
    delay(2);
  }
  
  Serial.print(p1);
  Serial.println(p2);
  if(p1 > 520 && p1 < 880 && p2 > 520 && p2 < 880) {
    int d = p1-p2; // d min is -360. d max is 360
    
    int dmap = map(d, -360, 360, -100, 100);
//    Serial.print(d);
//    Serial.println(dmap);
    Mouse.move(0,0,dmap);
  } else {
//    Mouse.move(0,0,0);
  }
  
  
}

// This function follows the steps described in the FSLP
// integration guide to measure the position of a force on the
// sensor.  The return value of this function is proportional to
// the physical distance from drive line 2, and it is between
// 0 and 1023.  This function does not give meaningful results
// if fslpGetPressure is returning 0.
int fslpGetPosition()
{
  // Step 1 - Clear the charge on the sensor.
  pinMode(fslpSenseLine, OUTPUT);
  digitalWrite(fslpSenseLine, LOW);

  pinMode(fslpDriveLine1, OUTPUT);
  digitalWrite(fslpDriveLine1, LOW);

  pinMode(fslpDriveLine2, OUTPUT);
  digitalWrite(fslpDriveLine2, LOW);

  pinMode(fslpBotR0, OUTPUT);
  digitalWrite(fslpBotR0, LOW);

  // Step 2 - Set up appropriate drive line voltages.
  digitalWrite(fslpDriveLine1, HIGH);
  pinMode(fslpBotR0, INPUT);
  pinMode(fslpSenseLine, INPUT);

  // Step 3 - Wait for the voltage to stabilize.
  delayMicroseconds(10);

  // Step 4 - Take the measurement.
  analogReset();
  return analogRead(fslpSenseLine);
}

// This function follows the steps described in the FSLP
// integration guide to measure the pressure on the sensor.
// The value returned is usually between 0 (no pressure)
// and 500 (very high pressure), but could be as high as
// 32736.
int fslpGetPressure()
{
  // Step 1 - Set up the appropriate drive line voltages.
  pinMode(fslpDriveLine1, OUTPUT);
  digitalWrite(fslpDriveLine1, HIGH);

  pinMode(fslpBotR0, OUTPUT);
  digitalWrite(fslpBotR0, LOW);

  pinMode(fslpSenseLine, INPUT);

  pinMode(fslpDriveLine2, INPUT);

  // Step 2 - Wait for the voltage to stabilize.
  delayMicroseconds(10);

  // Step 3 - Take two measurements.
  analogReset();
  int v1 = analogRead(fslpDriveLine2);
  analogReset();
  int v2 = analogRead(fslpSenseLine);

  // Step 4 - Calculate the pressure.
  // Detailed information about this formula can be found in the
  // FSLP Integration Guide.
  if (v1 == v2)
  {
    // Avoid dividing by zero, and return maximum reading.
    return 32 * 1023;
  }
  return 32 * v2 / (v1 - v2);
}

// Performs an ADC reading on the internal GND channel in order
// to clear any voltage that might be leftover on the ADC.
// Only works on AVR boards and silently fails on others.
void analogReset()
{
#if defined(ADMUX)
#if defined(ADCSRB) && defined(MUX5)
    // Code for the ATmega2560 and ATmega32U4
    ADCSRB |= (1 << MUX5);
#endif
    ADMUX = 0x1F;

    // Start the conversion and wait for it to finish.
    ADCSRA |= (1 << ADSC);
    loop_until_bit_is_clear(ADCSRA, ADSC);
#endif
}

