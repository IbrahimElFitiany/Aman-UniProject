const { DataTypes } = require('sequelize');

const RoomModel = (sequelize) => {
    const Room = sequelize.define('room', {
        room_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        house_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'houses', // Assuming your houses table is named 'houses'
                key: 'house_id',
            },
            onDelete: 'CASCADE', // Deletes rooms if the house is deleted
        },
        room_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        sensor_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'sensors', // Assuming your sensors table is named 'sensors'
                key: 'sensor_id',
            },
        },
    }, {
        tableName: 'rooms',
        timestamps: false, // Disable timestamps if not needed
    });

    return Room;
};


module.exports = RoomModel