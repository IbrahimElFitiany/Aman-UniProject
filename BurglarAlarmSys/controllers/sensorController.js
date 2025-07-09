const { House, Room, Furniture , TheftLog } = require('../models/index');
const {sensor} = require('../services/mqttService');



const sensorController = {

    clickOnRoom: async (req, res,currentRoom) => {

        try {
            const message = { 
                "sensor_id":currentRoom.sensor_id ,
                "house_id": currentRoom.house_id,
                "timestamp": new Date().toISOString(), 
                "event": "door-sensor-triggerd" 
            }
            
            sensor.publish('sensor/topic', JSON.stringify(message), (err) => {
                if (err) {
                    console.error('Publish failed:', err);
                } else {
                    console.log("Message published to topic 'sensor/topic'");
                }
            });

            await TheftLog.create(
                { 
                    user_id: req.user.id,
                    house_id: currentRoom.house_id,
                    room_id: currentRoom.room_id,
                    timestamp: new Date().toISOString(),
                    action_taken: 'Door sensor triggered',
                });
 
        } catch (error) {
            console.error('Error in clickOnFurniture:', error);
        }
    },
    clickOnFurniture: async (req, res) => {
        const { furnitureId, roomName } = req.params;

        try {
            const currentHouse = await House.findOne({ where: { user_id: req.user.id } });
            if (!currentHouse) return res.status(404).json({ message: 'House not found' });

            const currentRoom = await Room.findOne({
                where: { house_id: currentHouse.house_id, room_name: roomName }
            });
            if (!currentRoom) return res.status(404).json({ message: 'Room not found' });

            const furniture = await Furniture.findOne({
                where: { room_id: currentRoom.room_id, furniture_id: furnitureId }
            });
            if (!furniture) return res.status(404).json({ message: 'Furniture not found' });

            if (req.user.isThief && furniture.sensor_id != null) {
                
                const message = { 
                    "sensor_id":furniture.sensor_id ,
                    "timestamp": new Date().toISOString(), 
                    "event": "movement_detected" 
                }
                
                sensor.publish('sensor/topic', JSON.stringify(message), (err) => {
                    if (err) {
                        console.error('Publish failed:', err);
                        return res.status(500).json({ message: 'Failed to trigger sensor' });
                    } else {
                        console.log("Message published to topic 'sensor/topic'");
                        return res.status(200).json({ message: 'Thief detected!' });
                    }
                });

                await TheftLog.create(
                    { 
                        user_id: req.user.id,
                        house_id: currentRoom.house_id,
                        room_id: currentRoom.room_id,
                        timestamp: new Date().toISOString(),
                        action_taken: 'movement sensor triggered',
                    });

            } else {
                return res.status(403).json({ message: 'Action not allowed' });
            }
        } catch (error) {
            console.error('Error in clickOnFurniture:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

};

module.exports = sensorController;
