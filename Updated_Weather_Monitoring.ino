#include <LiquidCrystal_I2C.h>

#include <DHT.h>

#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP085_U.h>

Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(10085);

LiquidCrystal_I2C lcd(0x27, 16, 2);

int MQ135_PIN = A0;
int LDR = A1;
int DHT11_PIN = A2;

#define DHTTYPE DHT11   // DHT 11

DHT dht(DHT11_PIN, DHTTYPE);

bool DHT_flag = 0;

void setup() {
  
  Serial.begin(9600);
 
  dht.begin();

  if (!bmp.begin()) {
    Serial.println("Could not find a valid BMP085/BMP180 sensor, check wiring!");
    while (1) {}
  }

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("  IoT  WEATHER  ");
  lcd.setCursor(0, 1);
  lcd.print(" MONITOR SYSTEM ");
  delay(1500);
}

void loop() {
  sensors_event_t event;
  bmp.getEvent(&event);

  lcd.clear();
  
  if (event.pressure) {
    Serial.print(event.pressure);
    Serial.print(",");
    Serial.print(bmp.pressureToAltitude(1013.25, event.pressure));
    Serial.print(",");

    lcd.setCursor(0, 0);
    lcd.print("Press:");
    lcd.print(event.pressure);
    lcd.print("hPa");
    lcd.setCursor(0, 1);
    lcd.print("Altitude:");
    lcd.print(bmp.pressureToAltitude(1013.25, event.pressure));
    lcd.print("m");

    delay(2000);
  }

  ReadDHT();
  ReadMQ();
  ReadLight();
}

void ReadDHT(void)
{
  lcd.clear();

  Serial.print(ceil(dht.readTemperature()));
  Serial.print(",");
  Serial.print(dht.readHumidity());
  Serial.print(",");

  lcd.setCursor(0,  0);
  lcd.print("Temp:  ");
  lcd.print(dht.readTemperature(), 1);
  lcd.print(" C");
  lcd.setCursor(0, 1);
  lcd.print("Humi:  ");
  lcd.print(dht.readHumidity());
  lcd.print(" %");

  delay(2000);
}

void ReadMQ(void)
{
  int airqlty = 0;
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("AIR QUALITY:");
  airqlty  = analogRead(MQ135_PIN);
  Serial.print(map(airqlty, 0, 1024, 99,  0));
  Serial.print(",");
  lcd.print(map(airqlty, 0, 1024, 99,  0));
  lcd.print("%");
  lcd.setCursor(0, 1);
  if (airqlty <= 180)
    lcd.print("GOOD!");
  else if (airqlty > 180 && airqlty <= 225)
    lcd.print("POOR!");
  else if (airqlty > 225 && airqlty <= 300)
    lcd.print("VERY BAD!");
  else
    lcd.print("TOXIC!");

  delay(2000);
}

void ReadLight(void)
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("SOLAR LIGHT: ");
  Serial.println(map(analogRead(LDR), 0, 1024, 99, 0));
  lcd.print(map(analogRead(LDR), 0, 1024, 99, 0));
  lcd.print("%");
  lcd.setCursor(0, 1);
  lcd.print("******");
  delay(2000);
}