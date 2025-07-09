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


router
.route('/room')
.post(verifyToken, userController.addRoom)
.delete(verifyToken, userController.removeRoom)
.put (verifyToken, userController.updateRoom);

//==========================================================================================================

router
.route('/rooms/:roomName/')
.get(verifyToken,userController.listFurniture)
.post(verifyToken, userController.addFurniture)

router.route('/rooms/:roomId')
.delete(verifyToken, userController.deleteFurniture);

//==========================================================================================================

//click on furniture?? idk
router
.route('/rooms/:roomName/:furnitureId')
.post(verifyToken, sensorController.clickOnFurniture);

module.exports = router;