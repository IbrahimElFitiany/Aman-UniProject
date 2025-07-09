const { DataTypes } = require('sequelize');

const SensorModel = (sequelize) => {
    const Sensor = sequelize.define('sensor', {
        sensor_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        sensor_type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isIn: [['Movement Detector', 'Door Sensor']], // Validation for sensor types
            },
        },
    }, {
        tableName: 'sensors',
        timestamps: false, // Disable timestamps if not needed
    });

    return Sensor;
};

module.exports = SensorModel;
