const { DataTypes } = require('sequelize');

const FurnitureModel = (sequelize) => {
    const Furniture = sequelize.define('furniture', {
        furniture_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        room_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'rooms', // Assuming your rooms table is named 'rooms'
                key: 'room_id',
            },
            onDelete: 'CASCADE', // Deletes furniture if the room is deleted
        },
        furniture_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        sensor_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'sensors', // Assuming your sensors table is named 'sensors'
                key: 'sensor_id',
            },
        }
    }, {
        tableName: 'furniture',
        timestamps: false, // Disable timestamps if not needed
    });

    return Furniture;
};

module.exports = FurnitureModel;
