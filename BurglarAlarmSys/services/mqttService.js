const mqtt = require('mqtt');

// MQTT Publisher for user-triggered sensors
const sensor = mqtt.connect('mqtt://localhost:1883', {
    clientId: 'mqtt-publisher',
});

// Handle the MQTT connection
sensor.on('connect', () => {
    console.log("Sensor connected to broker");
});

sensor.on('error', (err) => {
    console.error("MQTT Connection error:", err);
});

module.exports = {
    sensor
}