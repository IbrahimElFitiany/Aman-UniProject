const mqtt = require('mqtt');

// Create MQTT client to subscribe to a topic
const client = mqtt.connect('mqtt://localhost:1883', {
    clientId: 'policeStationSubscriber',
});

client.on('connect', () => {
    console.log('Connected to MQTT broker');

    client.subscribe('sensor/topic', (err) => {
        if (err) {
            console.error('Failed to subscribe to topic:', err);
        } else {
            console.log('Subscribed to topic: sensor/topic');
        }
    });

    client.subscribe('addHouse/topic', (err) => {
        if (err) {
            console.error('Failed to subscribe to topic:', err);
        } else {
            console.log('Subscribed to topic: addHouse/topic');
        }
    });
    
});


// Export the client for use in other parts of your app
module.exports = client;
