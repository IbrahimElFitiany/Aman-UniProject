const { where } = require('sequelize');
const { House, Room, TheftLog , PoliceTracking} = require('../../BurglarAlarmSys/models/index');
const client = require("../services/mqtt");
const { status } = require('express/lib/response');


const policeController = {

    //track el triggered sensors w bt add el new houses in real time 
    track: async (req, res) => {
        try {
            const houses = await House.findAll();  // Fetch all houses

            // MQTT listener for receiving sensor messages
            client.on('message', (topic, message) => {
                console.log(`Message received on topic ${topic}:`, message.toString());
            
                const data = JSON.parse(message.toString());
            
                if (topic === 'sensor/topic') {
                    console.log('Handling message from sensor/topic');

                    // Emit the data to WebSocket clients connected to /police/track
                    const trackNamespace = req.app.get('io').of('/police/track');
                    trackNamespace.emit('sensorTriggered', data); // Emit the data to WebSocket clients
                } 

                else if (topic === 'addHouse/topic') {
                    console.log('Handling message from addHouse/topic');

                    // Emit the data to WebSocket clients connected to /police/track
                    const trackNamespace = req.app.get('io').of('/police/track');
                    trackNamespace.emit('houseAdded', data); // Emit the data to WebSocket clients
                }
            });
            
            // Respond with both the houses and the tracking status
            res.status(200).json({
                houses: houses,  // Include the list of houses in the response
            });
        } 
        
        catch (error) {
            console.error('Error in policeController.track:', error);
            res.status(500).json({ error: 'An error occurred while starting tracking.' });
        }
    },
    //bt -get el rooms , w law feh theif bt get loc el room el feha el theif
    trackHouseRooms: async (req, res) => {
        try {

            //get all rooms by houseID
            const houseId = req.params.houseId; // Get houseId from request parameters
            const rooms = await Room.findAll({ 
                where: { house_id: houseId } // Use correct Sequelize syntax
            });

            //----------------------------------
    
            // Find the latest theft log for the given userId
            const latestTheftLog = await TheftLog.findOne({
                where: { house_id: houseId },
                order: [['log_timestamp', 'DESC']], // Order by most recent theft log
            });

            if (!latestTheftLog) {
                return res.status(200).json({
                    rooms,
                    status: 'no theif in the House',
                 });
            }
            else{
                const policelogs = await PoliceTracking.findOne({
                    where: {theft_log_id: latestTheftLog.log_id}
                })
    
                if (policelogs == null) {
                     // Get the room ID from the latest theft_log entry
                     const roomId = latestTheftLog.room_id;
                     const roomName = await Room.findOne({
                        where: {room_id: roomId}
                    })
            
                     // Send the room ID as the response
                     res.status(200).json(
                     { 
                         rooms,
                         "Theif in RoomID": roomId,
                         "Theif in RoomName": roomName.room_name
                     });
                }
    
                else{
                    return res.status(200).json({ status: 'no theif in the House' });
                }

            }
    
            

        } 
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while getting room details' });
        }
    },
    fireAlarm: async (req, res) => {
        try {
            const { houseId, roomId } = req.body; // Get houseId and roomId from the request body
    
            // Check if houseId and roomId are provided
            if (!houseId || !roomId) {
                return res.status(400).json({ error: 'House ID and Room ID are required' });
            }
    
            // Fetch the latest theft log for the house and room
            const latestTheftLog = await TheftLog.findOne({
                where: { house_id: houseId, room_id: roomId },
                order: [['log_timestamp', 'DESC']],
            });
    
            if (!latestTheftLog) {
                return res.status(404).json({ error: 'No theft logs found for this house and room' });
            }
    
            // Add a new entry to the Police_Tracking table with resolved as false
            const newPoliceTrackingEntry = await PoliceTracking.create({
                theft_log_id: latestTheftLog.log_id,
                resolved: false,
                resolved_timestamp: null, // Initially no resolved timestamp
            });
    
            // Emit the event to the '/police/track' namespace
            const trackNamespace = req.app.get('io').of('/police/track');
            trackNamespace.emit('takeAction', {
                message: "Alarm Fired by police for the room under threat",
                houseId: houseId,
                roomId: roomId,
            });
    
            // Simulate waiting for 5 seconds to resolve the log
            setTimeout(async () => {
                // Resolve the entry after 5 seconds
                await newPoliceTrackingEntry.update({
                    resolved: true,
                    resolved_timestamp: new Date(), // Current timestamp for resolution
                });
                trackNamespace.emit('actionTaken', {
                    message: "Action taken by police for the room under threat",
                    houseId: houseId,
                    roomId: roomId,
                });

            }, 10000);
    
            // Respond back with success
            res.status(200).json({
                message: 'Fire alarm triggered and logged for room',
                houseId: houseId,
                roomId: roomId,
                theftLogId: latestTheftLog.log_id,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while triggering the alarm' });
        }
    },
    
};

// Export the controller
module.exports = policeController;
