const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const policeRoutes = require('./routes/policeRoutes'); // Import the routes file
const cors = require('cors');

const app = express();
const server = http.createServer(app);
app.use(cors());

// Initialize Socket.IO with the HTTP server
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Set up the /police/track namespace here
const trackNamespace = io.of('/police/track');

trackNamespace.on('connection', (socket) => {
    console.log(`A client connected to /police/track socketid: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`A client disconnected from /police/track socketid: ${socket.id}`);
    });
});

// Make the io instance available to routes
app.set('io', io);

// Use the police routes
app.use(express.json());
app.use('/police', policeRoutes);

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Police app listening on http://localhost:${PORT}`);
});
