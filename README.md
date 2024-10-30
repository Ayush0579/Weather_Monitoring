# IoT-based Weather Monitoring System

### Overview

This project is an IoT-based Weather Monitoring System that provides real-time weather data visualization through a web interface. It uses WebSocket technology to receive data from IoT sensors and displays various weather parameters using interactive gauges and charts.

Thingspeak Channel: https://thingspeak.mathworks.com/channels/2605149

### Features

1. Real-time display of temperature, humidity, air quality, solar intensity, pressure, and altitude
2. Interactive widgets for each weather parameter
3. Expandable detailed view for each parameter with historical data chart
4. Disaster alert system based on weather conditions
5. Crop recommendation system based on current weather data
6. Downloadable historical weather data in CSV format

### Technologies Used

1. HTML5
2. CSS3
3. JavaScript
4. Chart.js for data visualization
5. WebSocket for real-time data communication
6. Python backend (implied from the /predict endpoint)

### Setup and Installation

1. Ensure you have a WebSocket server running on ws://localhost:8080 that sends weather data. (Run 'node app' command to run the app file)
2. Make sure you have a Python backend server running on http://127.0.0.1:5000 for predictions. (Run 'python app.py' command to run the flask app)
3. Place all icon images in an Icons folder in the same directory as the HTML files.
4. Open the form.html file in a web browser. 

## Usage

1. The main dashboard displays six widgets for different weather parameters.
2. Click on any widget to view detailed information and historical data.
3. The "Currently Growable Crops" section updates based on current weather conditions.
4. Click the "Download Historical Data (CSV)" button to download weather data in CSV format.

## Miscellaneous
### Data Format

The WebSocket server should recieve data in the following format:
pressure,altitude,temperature,humidity,airQuality,solarIntensity

### Alert System

The system will display alerts for potential weather-related disasters based on the received data.
The form.html page also checks for correct soil evaluation values, and alerts for errored data.

### Crop Recommendation

The system predicts suitable crops based on current weather conditions and displays them in the sidebar.
The AI model includes configurations for 19 crops to be checked against the recorded values.

## Customization

Modify the CSS in the <style> section to change the appearance.
Adjust the data-max-value and data-section attributes of the widget divs to change the ranges and sections of the gauges.

## Note

This system requires active WebSocket and HTTP servers to function properly. Ensure all backend services are running before using the dashboard.
