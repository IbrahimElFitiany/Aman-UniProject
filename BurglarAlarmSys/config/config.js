const Sequelize = require('sequelize');

const db = new Sequelize('burglar_alarm_sys', 'postgres', 'password', {
    host: 'localhost', // or the appropriate IP if not 'localhost'
    port: 5432,        // ensure this port matches the Docker port mapping
    dialect: 'postgres',
});

module.exports = db;
