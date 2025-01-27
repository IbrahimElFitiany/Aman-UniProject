const express = require('express');
const router = express.Router();
const policeController = require('../controllers/policeController')


//track route
router
.route('/track')
.get(policeController.track);


//track rooms and status
router
.route('/:houseId/trackRooms')
.get(policeController.trackHouseRooms);


//fire alarm in house
router
.route('/firealarm')
.post(policeController.fireAlarm);



module.exports = router;