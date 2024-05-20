var mqtt = require('mqtt');
var mysql = require('mysql2');
var WebSocket = require('ws');

var mqttOptions = {
    host: "172.20.10.5",
    port: 1883,
    protocol: "mqtt",
    username: "Tungc1",
    password: "2002",
};

var mysqlConfig = {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "iot",
};

// Initialize MQTT client
var mqttClient = mqtt.connect(mqttOptions);

// Initialize MySQL connection
var mysqlConnection = mysql.createConnection(mysqlConfig);

var wss = new WebSocket.Server({ port: 8080 });

function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// MQTT connect event
mqttClient.on('connect', function () {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(['sensor', 'led', 'fan']);
});

mqttClient.on('message', (topic, message) => {
    console.log('Received message from topic:', topic);
    console.log('Content:', message.toString());

    if (topic === "sensor") {
        const data = JSON.parse(message);
        const query = 'INSERT INTO sensor (temperature, humidity, light, wind,created_at) VALUES (?, ?, ?, ?,NOW())';
        const values = [data.temperature, data.humidity, data.light, data.wind];
        mysqlConnection.query(query, values, (err, results) => {
            if (err) console.error('Error saving sensor data to MySQL:', err);
            else console.log('Sensor data saved to MySQL');
        });
        broadcast(data);
    }

    if (topic === "led" || topic === "fan") {
        var device = topic.toUpperCase();
        var action = message.toString();
        saveDeviceAction(device, action);
    }
});

function saveDeviceAction(device, action) {
    var query = 'INSERT INTO devices (device, action, created_at) VALUES (?, ?, NOW())';
    var values = [device, action];
    mysqlConnection.query(query, values, (err, results) => {
        if (err) console.error('Error saving device action to MySQL:', err);
        else console.log('Device action saved to MySQL');
    });
}

// MySQL connect event
mysqlConnection.connect(function (error) {
    if (error) console.error('Error connecting to MySQL:', error);
    else console.log('Connected to MySQL database');
});
