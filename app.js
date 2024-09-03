// Import dependencies
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Defining the serial port
const port = new SerialPort("COM12", {
    baudRate: 9600,
});

// The Serial port parser
const parser = new Readline();
port.pipe(parser);

// Broadcast to all connected clients
function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Read the data from the serial port
parser.on("data", (line) => {
    console.log('Data:', line.toString());
    broadcast(line.toString());
});

console.log('WebSocket server running on ws://localhost:8080');