const { DataTypes } = require('sequelize');

const HouseModel = (sequelize) => {
    const House = sequelize.define('house', {
        house_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Assuming your users table is named 'users'
                key: 'user_id',
            },
            onDelete: 'CASCADE', // Ensures houses are deleted if the user is deleted
            unique: true, // One house per user
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false, // Adjust to false if address is required
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        tableName: 'houses',
        timestamps: false, // Disable timestamps if not needed
    });

    return House;
};

module.exports = HouseModel;
