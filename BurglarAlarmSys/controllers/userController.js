const { where } = require('sequelize');
const { User,House,Room,Sensor,Furniture} = require('../models/index');
const sensorController = require('./sensorController')
const {sensor} = require("../services/mqttService")

const userController = {

    // Register
    register: async (req, res) => {
        const { username, password , email , latitude , longitude , address} = req.body;

        if (!username || !password || !email || !latitude || !longitude) 
            { return res.status(400).json({ error: "All fields are required." })
        };

        try {
            
            const newUser = await User.create({
                username,
                password_hash: password,
                email,
            });
            const UserHouse = await House.create({
                user_id: newUser.user_id,
                address,
                longitude,
                latitude

            })

            try {
                const message = { 
                    "house_id": UserHouse.house_id,
                    "user_id":newUser.user_id,
                    "address": UserHouse.address,
                    "longitude": UserHouse.longitude,
                    "latitude": UserHouse.latitude,
                    "event": "new house added" ,
                    "timestamp": new Date().toISOString(), 
                }
                
                sensor.publish('addHouse/topic', JSON.stringify(message), (err) => {
                    if (err) {
                        console.error('Publish failed:', err);
                    } else {
                        console.log("Message published to topic 'addHouse/topic'");
                    }
                });
     
            } catch (error) {
                console.error('Error in clickOnFurniture:', error);
            }

            res.status(201).json({ message: 'User created successfully', user: newUser });
        } 
        catch (error) {
            res.status(500).json({ error: error.message});
        }
    },
    //list rooms
    listRooms: async (req, res) => {


        const userHouse = await House.findOne({ where: { user_id: req.user.id } }); 

        try {
            // get all rooms
            const rooms = await Room.findAll({ where: {house_id: userHouse.house_id } });
    
            // Handle case where the room is not found
            if (!rooms) {
                return res.status(404).json({ error: "no Rooms" });
            }
    
            res.status(201).json({
                rooms,
                message: "listed all of the rooms",
            });
        } catch (error) {
            // Handle any server-side errors
            res.status(500).json({ error: error.message });
        }
    },
    // Add Room
    addRoom: async (req, res) => {

        const { roomName, hasSensor} = req.body;

        // check for fields
        if (!roomName || hasSensor == null) 
            { return res.status(400).json({ error: "Enter All fields" })
        };

        //find the house of the current logged in user using user token from the req
        const house = await House.findOne({ where: { user_id: req.user.id } }); 

        // Check if a room with the same name already exists in the house
        const existingRoom = await Room.findOne({
            where: {
            house_id: house.house_id,
            room_name: roomName
            }
        });
        
        if (existingRoom) {
            return res.status(400).json({
            error: "A room with this name already exists in the house."
            });
        }
        
        let sensorId = null

        if (hasSensor) 
            { 
            const newSensor = await Sensor.create({sensor_type: "Door Sensor"})
            sensorId = newSensor.sensor_id

        }

        try {
            const newRoom = await Room.create({
                house_id: house.house_id,
                room_name: roomName,
                sensor_id: sensorId

            });

            res.status(201).json({ message: 'Room created successfully'});
        } 
        catch (error) {
            res.status(500).json({ error: error.message});
        }
    },
    // Remove Room
    removeRoom: async (req, res) => {
        const { roomName } = req.body;
    
        // Check for fields
        if (!roomName) {
            return res.status(400).json({ error: "Enter All fields" });
        }
    
        try {
            // Find the house of the currently logged-in user using user token from the req
            const house = await House.findOne({ where: { user_id: req.user.id } });
    
            // Check if a room with the same name already exists in the house
            const existingRoom = await Room.findOne({
                where: {
                    house_id: house.house_id,
                    room_name: roomName
                }
            });
    
            if (!existingRoom) {
                return res.status(400).json({ error: "No Room with this name." });
            }

            if (existingRoom.sensor_id) {
                await Sensor.destroy({
                    where: { sensor_id: existingRoom.sensor_id }
                });
            }
            
            await existingRoom.destroy();

            res.status(200).json({ message: 'Room deleted successfully' }); // Send a response
        } 
        
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //update Room
    updateRoom: async (req, res)=>{

    },

    //=============================================


    //list Furniture in Room
    listFurniture: async (req, res) => {
        const { roomName } = req.params; // Extract roomName from URL parameters
    
    
        const userHouse = await House.findOne({ where: { user_id: req.user.id } }); 

        try {
            // Find the room by its name
            const room = await Room.findOne({ where: { room_name: roomName , house_id: userHouse.house_id } });
    
            // Handle case where the room is not found
            if (!room) {
                return res.status(404).json({ error: "Room not found" });
            }

            const furniture = await Furniture.findAll({where:{room_id: room.room_id}})
    
            // Check if the user is flagged as a thief
            const userIsThief = req.user.isThief;
            if (userIsThief && room.sensor_id != null){
                
                sensorController.clickOnRoom(req,res,room)
                console.log(`User is thief: ${userIsThief}`);
            }
            
    
            // Respond with success and the created furniture object
            res.status(201).json({
                furniture,
                isThief: userIsThief
            });
        } catch (error) {
            // Handle any server-side errors
            res.status(500).json({ error: error.message });
        }
    },
    // add Furniture
    addFurniture: async (req, res) => {
        const { roomName } = req.params; // Extract roomName from URL parameters
        const { furnitureName , hasSensor , user } = req.body; // Extract furnitureName from the request body
    
        // Validate required fields
        if (!furnitureName || hasSensor == null) {
            return res.status(400).json({ error: "Please provide furnitureName" });
        }
    
        const userHouse = await House.findOne({ where: { user_id: req.user.id } }); 

        try {
            // Find the room by its name
            const room = await Room.findOne({ where: { room_name: roomName , house_id: userHouse.house_id } });
    
            // Handle case where the room is not found
            if (!room) {
                return res.status(404).json({ error: "Room not found" });
            }
    

            let sensorId = null

            if (hasSensor) 
                { 
                const newSensor = await Sensor.create({sensor_type: "Movement Detector"})
                sensorId = newSensor.sensor_id
    
            }

            // Create a new furniture entry associated with the found room
            const newFurniture = await Furniture.create({
                room_id: room.room_id,
                furniture_name: furnitureName,
                sensor_id: sensorId
            });
    
            // Respond with success and the created furniture object
            res.status(201).json({
                message: "Furniture added successfully",
                furniture: newFurniture,
            });
        } catch (error) {
            // Handle any server-side errors
            res.status(500).json({ error: error.message });
        }
    },
    //delete Furniture
    deleteFurniture: async (req, res) => {
        const {roomName} = req.params; // Extract roomName from URL parameters
        const {furnitureName} = req.body; // Extract furnitureName from the request body
    
        // Validate required fields
        if (!furnitureName) {
            return res.status(400).json({ error: "Please provide furnitureName" });
        }
    
        const userHouse = await House.findOne({ where: { user_id: req.user.id } }); 

        try {
            // Find the room by its name
            const room = await Room.findOne({ where: { room_name: roomName , house_id: userHouse.house_id}});
    
            // Handle case where the room is not found
            if (!room) {
                return res.status(404).json({ error: "Room not found" });
            }

            const existingFurniture = await Furniture.findOne({where:{room_id:room.room_id , furniture_name: furnitureName}})
            
            
            if (!existingFurniture) {
                return res.status(400).json({ error: "No furniture with this name." });
            }

            await existingFurniture.destroy();

            if (existingFurniture.sensor_id) {
                await Sensor.destroy({
                    where: { sensor_id: existingFurniture.sensor_id }
                });
            }
            
            

    
            // Respond with success and the created furniture object
            res.status(201).json({
                message: "Furniture deleted successfully",
            });
        } catch (error) {
            // Handle any server-side errors
            res.status(500).json({ error: error.message });
        }
    },

};

module.exports = userController;
