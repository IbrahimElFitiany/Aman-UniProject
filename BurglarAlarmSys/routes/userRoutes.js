const express = require('express');
const router = express.Router();
const allModels = require('../models/index')
const userController = require('../controllers/userController')
const sensorController = require('../controllers/sensorController')
const bcrypt = require('bcrypt')
const {verifyToken} = require('../middleware/authMiddleware')



//register route
router
.route('/register')
.post(userController.register);

//==========================================================================================================

//list all rooms route
router
.route('/rooms')
.get(verifyToken, userController.listRooms);

// add room route
router
.route('/addRoom')
.post(verifyToken, userController.addRoom);

//remove room route
router
.route('/removeRoom')
.post(verifyToken, userController.removeRoom);

//==========================================================================================================

// list furniture in room
router
.route('/rooms/:roomName/')
.get(verifyToken,userController.listFurniture);


//add furniture to a room
router
.route('/rooms/:roomName/addFurniture')
.post(verifyToken, userController.addFurniture);

//delete furniture from a room
router
.route('/rooms/:roomName/delete_furniture')
.post(verifyToken, userController.deleteFurniture);

//==========================================================================================================

//click on furniture?? idk
router
.route('/rooms/:roomName/:furnitureName')
.post(verifyToken, sensorController.clickOnFurniture);

module.exports = router;