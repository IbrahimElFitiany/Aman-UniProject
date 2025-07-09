const socketIoClient = require('socket.io-client');

// Connect to the WebSocket server
const socket = socketIoClient('ws://localhost:3001/police/track', {
    transports: ['websocket'], // Force WebSocket transport (if there's an issue with other transports like polling)
});


// Log when the client successfully connects
socket.on('connect', () => {
    console.log('WebSocket client connected');
});

// Log connection errors if any
socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
});

// Listen for the 'sensorTriggered' event
socket.on('sensorTriggered', (data) => {
    console.log('Sensor triggered:', data);
});

// Listen for the 'houseAdded' event
socket.on('houseAdded', (data) => {
    console.log('houseAdded:', data);
});


console.log('WebSocket client is running...');
