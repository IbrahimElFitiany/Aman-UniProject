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
                model: 'users',
                key: 'user_id',
            },
            onDelete: 'CASCADE',
            unique: true,
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
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
        timestamps: false,
    });

    return House;
};

module.exports = HouseModel;
