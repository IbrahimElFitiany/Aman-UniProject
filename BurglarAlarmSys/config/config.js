const Sequelize = require('sequelize');

const db = new Sequelize('AmanUni', 'postgres', 'password', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
});

module.exports = db;
