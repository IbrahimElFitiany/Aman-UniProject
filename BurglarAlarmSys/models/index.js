const Sequelize = require('sequelize');
const db = require('../config/config.js')


// Manually import each model
const Furniture = require('./Furniture.js')(db)
const House = require('./House.js')(db);
const Room = require('./Room.js')(db)
const Sensor = require('./Sensor.js')(db);
const TheftLog = require('./TheftLog.js')(db);
const User = require('./User.js')(db);
const PoliceTracking = require('./PoliceTracking.js')(db);



// Export models and Sequelize instance
const allModels = {
    Furniture,
    House,
    Room,
    Sensor,
    TheftLog,
    User,
    PoliceTracking
};

module.exports = allModels;
