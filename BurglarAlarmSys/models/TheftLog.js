const { DataTypes } = require('sequelize');

const TheftLogsModel = (sequelize) => {
    const TheftLog = sequelize.define('theft_log', {
        log_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        house_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'houses', // Assuming your houses table is named 'houses'
                key: 'house_id',
            },
            allowNull: false, // Assuming house_id is required; adjust if nullable
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users', // Assuming your users table is named 'users'
                key: 'user_id',
            },
            allowNull: false, // Assuming user_id is required; adjust if nullable
        },
        room_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'rooms', // Assuming your rooms table is named 'rooms'
                key: 'room_id',
            },
            allowNull: false, // Assuming room_id is required; adjust if nullable
        },
        action_taken: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        log_timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Default to the current timestamp
        },
    }, {
        tableName: 'theft_logs',
        timestamps: false, // Disable timestamps if not needed
    });

    return TheftLog;
};

module.exports = TheftLogsModel;
