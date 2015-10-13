/*
Adafruit Arduino - Lesson 3. RGB LED
*/
 
int redPin = 6;  
int greenPin = 5;
int bluePin = 3;
int real_frameRate = 30;
int frameRate = 1000/real_frameRate;
String inString = "";    // string to hold input
int index =0;
char inputChar[16];
//uncomment this line if using a Common Anode LED
//#define COMMON_ANODE
void setup()
{
  Serial.begin(9600);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);  
}
 
 
void loop()
{
  if(Serial.available()>0){
    int inChar = Serial.read();
    inString += (char)inChar;
    
    if (inChar == '\n') {
      inString.toCharArray(inputChar,16);
      Serial.print("String: ");
      Serial.print(inString);
      Serial.print("  len: ");
      Serial.println(inString.length());
      index = inString.length()-1;
      // clear the string for new input:
      Serial.println("----------------");
      while(true){
        setColor(0, 0, 255);  // blue
        analogWrite(bluePin,0);
        for(int i=0;i<index;i++){
          Serial.print(i);
          Serial.print(" - ");
          Serial.println((char)inputChar[i]);
          getBit(inputChar[i]);
          setColor(0, 0, 255);  // blue
          delay(frameRate*5);
          Serial.println("");
        }
        Serial.println("----------------------------");
      }
      inString = "";
      index = 0;
    }
  } 
}
 
void setColor(int red, int green, int blue)
{
  #ifdef COMMON_ANODE
    red = 255 - red;
    green = 255 - green;
    blue = 255 - blue;
  #endif
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue); 
}

void getBit(char inputChar){
  // This will 'output' the binary representation of 'inputChar' as 8 characters of '1's and '0's, MSB first.
  Serial.print("getBit( ) ====>");
  Serial.println(inputChar);
  for ( uint8_t bitMask = 128; bitMask != 0; bitMask = bitMask >> 1 ) {
    if ( inputChar & bitMask ) {
        setColor(128, 0, 0);  // red
        Serial.print("1 ");
        delay(frameRate);
        analogWrite(redPin,0); 
    } else {
       setColor(0, 128, 0);  // green
        Serial.print("0 ");
        delay(frameRate);
        analogWrite(greenPin,0); 
    }
  }
}
