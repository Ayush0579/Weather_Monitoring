const ws = new WebSocket('ws://localhost:8080');

Values = [];

condition_predict = [];

const cropList = document.getElementById('cropList');
cropList.innerHTML = "";

let historyChartInstance;

cropsPrediction = [];
tempcropsPrediction = [];

const TempData = {
    labels: [],
    values: []
};
const HumiData = {
    labels: [],
    values: []
};
const AQIData = {
    labels: [],
    values: []
};
const CO2Data = {
    labels: [],
    values: []
};
const AirData = {
    labels: [],
    values: []
};
const SolarData = {
    labels: [],
    values: []
};
const PresData = {
    labels: [],
    values: []
};
const AltData = {
    labels: [],
    values: []
};

const widgets = document.querySelectorAll('.widget');
const expandedWidget = document.getElementById('expandedWidget');
const expandedTitle = document.getElementById('expandedTitle');
const expandedInfo = document.getElementById('expandedInfo');
const pointer = document.getElementById('pointer');
const progressBar = document.querySelector('.expanded-widget .progress-bar');
const section0Value = document.getElementById('section0Value');
const section1Value = document.getElementById('section1Value');
const section2Value = document.getElementById('section2Value');
const section3Value = document.getElementById('section3Value');
const currentValue = document.getElementById('currentValue');

function drawHistoryChart(labels, values, title) {
    const canvas = document.getElementById('historyChart');
    const ctx = canvas.getContext('2d');

    if (historyChartInstance) {
        historyChartInstance.destroy();
    }

    if(title != "Air Quality") {
        historyChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: values,
                    borderColor: '#00aaff',
                    backgroundColor: 'rgba(0, 170, 255, 0.2)',
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: false,
                maintainAspectRatio: false
            }
        });
    }
    else {
        historyChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Overall Air Quality',
                        data: AirData.values,
                        borderColor: '#00aaff',
                        backgroundColor: 'rgba(0, 170, 255, 0.2)',
                        fill: false,
                    },
                    {
                        label: 'CO2 Levels(ppm)',
                        data: CO2Data.values,
                        borderColor: '#ffaa00',
                        backgroundColor: 'rgba(255, 170, 0, 0.2)',
                        fill: true,
                    },
                    {
                        label: 'AQI',
                        data: AQIData.values,
                        borderColor: '#ff0000',
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        fill: false,
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: false,
                maintainAspectRatio: false
            }
        });
    }
    
}

function showAlert(message, disaster) {
    const alertContainer = document.getElementById('alertContainer');
    const alertMessage = document.getElementById('alertMessage');
    const alertInfo = document.getElementById('alertInfo');
    if (disaster == 'UNKNOWN') {} else {
        alertMessage.innerText = message;
        alertInfo.innerText = "Possible chances of " + disaster;
        alertContainer.style.display = 'flex';
    }
}

async function makePrediction(pressure,humidity,temperature,airQuality,solar) {
    condition_predict = [];
    cropList.innerHTML = "";

    const formData = {
        pressure: pressure,
        humidity: humidity,
        temperature: temperature,
        airQuality: airQuality,
        solar: solar
    };
    
    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        for (const [condition, value] of Object.entries(data.conditions)) {
            if (value === 1) {
                showAlert("Disaster Alert: ", condition);
            }
        }

        tempcropsPrediction = [];
        
        for (const [crop, value] of Object.entries(data.crops)) {
            if (value === 1) {
                tempcropsPrediction.push(crop);
                const li = document.createElement("li");
                const img = document.createElement("img");
                const source = "/Icons/" + crop + ".png";

                img.src = source;
                img.alt = crop + " Icon";
                img.style.width = "30px";  
                img.style.height = "30px"; 
                img.style.marginRight = "10px";
                img.style.borderRadius = "50%";
                img.style.border = "1px solid #ccc";
                img.style.boxShadow = "1px 1px 4px rgba(0, 0, 0, 0.1)";
                img.style.verticalAlign = "middle";

                li.appendChild(img);

                const textNode = document.createTextNode(crop);
                const span = document.createElement("span");
                span.style.fontWeight = "bold";
                span.appendChild(textNode);

                li.appendChild(span);

                cropList.appendChild(li);
            }

            cropsPrediction.push(tempcropsPrediction);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error occurred: ' + error.message);
    }
}

widgets.forEach(widget => {
    widget.addEventListener('click', () => {
        const title = widget.querySelector('h2').innerText;
        const maxValue = widget.getAttribute('data-max-value');
        const sections = widget.getAttribute('data-section').split(',');
        const section1Percent = sections[0];
        const section2Percent = sections[1];

        const pressure = parseInt(Values[0]);
        const altitude = parseInt(Values[1])-50;
        const temperature = parseInt(Values[2]);
        const humidity = parseInt(Values[3]);
        const co2 = parseInt(Values[4]);
        const airQuality = parseInt(Values[5]);
        solar = parseInt(Values[7]);

        if (solar >= 100) {
            solar = 100;
        }

        value = title === "Temperature" ? temperature : title === "Humidity" ? humidity : title === "Air Quality" ? airQuality : title === "Solar Intensity" ? solar : title === "Pressure" ? pressure : altitude;

        type = title === "Temperature" ? "C" : title === "Humidity" ? "%" : title === "Air Quality" ? "%" : title === "Solar Intensity" ? "%" : title === "Pressure" ? "h" : altitude;

        percentage = (value / maxValue) * 100;

        expandedTitle.innerText = title;

        if (title == "Altitude") {
            section0Value.innerText = "-1000";
            section0Value.style.left = `0%`;

            section1Value.innerText = "100";
            section1Value.style.left = `${section1Percent}%`;

            section2Value.innerText = "1500";
            section2Value.style.left = `${section2Percent}%`;

            section3Value.innerText = "3000";
            section3Value.style.left = `100%`;

            if (value < 0) {
                percentage = (1000-Math.abs(value))*0.025;
            } else {
                percentage = (1000+value)*0.025;
            }

            currentValue.innerText = `Current Value: ${value}m`;
            currentValue.style.left = `calc(${percentage}%)`;
            
            pointer.style.left = `calc(${percentage}%)`;
        } else {
            section0Value.innerText = "0";
            section0Value.style.left = `0%`;

            section1Value.innerText = Math.round(maxValue * (sections[0] / 100));
            section1Value.style.left = `${section1Percent}%`;

            section2Value.innerText = Math.round(maxValue * (sections[1] / 100));
            section2Value.style.left = `${section2Percent}%`;

            section3Value.innerText = maxValue;
            section3Value.style.left = `100%`;

            value = String(value);

            displayValue = type === "%" ? value + '%' : type === "C" ? value + '°C' : type === "h" ? value + ' hPa' : value;

            currentValue.innerText = `Current Value: ` + displayValue;
            currentValue.style.left = `calc(${percentage}%)`;

            pointer.style.left = `calc(${percentage}%)`;
        }

        if (title == "Air Quality") {
            progressBar.style.background = `
                linear-gradient(to right, 
                red ${sections[0]}%, 
                blue ${sections[0]}% ${sections[1]}%, 
                green ${sections[1]}%)`;
        } else if (title == "Humidity") {
            progressBar.style.background = `
                linear-gradient(to right, 
                red ${sections[0]}%, 
                green ${sections[0]}% ${sections[1]}%, 
                blue ${sections[1]}%)`;
        } else {
            progressBar.style.background = `
                linear-gradient(to right, 
                blue ${sections[0]}%, 
                green ${sections[0]}% ${sections[1]}%, 
                red ${sections[1]}%)`;
        }

        labels = title === "Temperature" ? TempData.labels : title === "Humidity" ? HumiData.labels : title === "Air Quality" ? AirData.labels : title === "Solar Intensity" ? SolarData.labels : title === "Pressure" ? PresData.labels : title === "Altitude" ? AltData.labels : None;
        values = title === "Temperature" ? TempData.values : title === "Humidity" ? HumiData.values : title === "Air Quality" ? AirData.values : title === "Solar Intensity" ? SolarData.values : title === "Pressure" ? PresData.values : title === "Altitude" ? AltData.values : None;

        drawHistoryChart(labels, values, title);

        expandedWidget.style.display = 'flex';
    });
});

function closeExpandedWidget() {
    expandedWidget.style.display = 'none';
}

function closeAlert() {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.style.display = 'none';
}

function drawGauge(canvasId, value, maxValue, type) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;
    maxValue = value > 0 ? maxValue : 500;
    const currentAngle = startAngle + (endAngle - startAngle) * (Math.abs(value) / maxValue);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#e0e0e0';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
    ctx.lineWidth = 20;
    if (value < 0){
        ctx.strokeStyle = '#ff0000';
    } else {
        ctx.strokeStyle = '#00aaff';
    }
    ctx.stroke();

    ctx.font = '40px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const displayValue = type === "%" ? value + '%' : type === "C" ? value + '°C' : type === "m" ? value + 'm' : value;

    ctx.fillText(displayValue, centerX, centerY);
}

function drawValueMeter(canvasId, value, isPercent) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = '50px Arial';
    ctx.fillStyle = '#00aaff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if(isPercent) {
        ctx.fillText(value + "%", centerX, centerY);
    }
    else {
        ctx.fillText(value + "hPa", centerX, centerY);
    }
}

drawGauge('gauge1', 0, 50, "C");
drawValueMeter('valueMeter1', 0, true);
drawGauge('gauge2', 0, 100, "%");
drawGauge('gauge3', 0, 100, "%");
drawValueMeter('valueMeter2', 0, false);
drawGauge('gauge4', 0, 2000, "m");

ws.onmessage = function(event) {
    const data = event.data;

    Values = data.split(",");

    const pressure = parseInt(Values[0]);
    const altitude = parseInt(Values[1])-50;
    const temperature = parseInt(Values[2]);
    const humidity = parseInt(Values[3]);
    const co2 = parseInt(Values[4]);
    const airQuality = parseInt(Values[5]);
    const aqi = parseInt(Values[6]);
    solar = parseInt(Values[7]);

    if (solar >= 100) {
        solar = 100;
    }

    console.log('Received:', data);
    drawGauge('gauge1', temperature, 50, "C");
    drawValueMeter('valueMeter1', humidity, true);
    drawGauge('gauge2', airQuality, 100, "%");
    drawGauge('gauge3', solar, 100, "%");
    drawValueMeter('valueMeter2', pressure, false);
    drawGauge('gauge4', altitude, 3000, "m");

    makePrediction(pressure, humidity, temperature, airQuality, solar);

    const now = new Date();
    const localTime = now.toString().replace(" (India Standard Time)","");
    

    TempData.labels.push(localTime);
    TempData.values.push(temperature);
    HumiData.labels.push(localTime);
    HumiData.values.push(humidity);
    CO2Data.labels.push(localTime);
    CO2Data.values.push(co2);
    AQIData.labels.push(localTime);
    AQIData.values.push(aqi);
    AirData.labels.push(localTime);
    AirData.values.push(airQuality);
    SolarData.labels.push(localTime);
    SolarData.values.push(solar);
    PresData.labels.push(localTime);
    PresData.values.push(pressure);
    AltData.labels.push(localTime);
    AltData.values.push(altitude);

    console.log(CO2Data);
};

ws.onopen = function() {
    console.log('WebSocket connection established');
};

ws.onclose = function() {
    console.log('WebSocket connection closed');
};

function downloadCSV() {
    csvContent = "Date & Time,Temperature(°C),Humidity(%),Overall Air Quality(%),Solar Intensity(%),Pressure(hPa),Altitude(m),Crops\n";

    for (let index = 0; index < TempData.values.length; index++) {
        const data = TempData.labels[index] + "," + TempData.values[index].toString() + "," + HumiData.values[index].toString() + "," + AirData.values[index].toString() + "," + SolarData.values[index].toString() + "," + PresData.values[index].toString() + "," + AltData.values[index].toString() + "," + cropsPrediction[index] + "\n";

        console.log(index, ": ", data);

        csvContent = csvContent+data;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "weather_historical_data.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    console.log(csvContent);
}

document.getElementById('downloadCSV').addEventListener('click', downloadCSV);          