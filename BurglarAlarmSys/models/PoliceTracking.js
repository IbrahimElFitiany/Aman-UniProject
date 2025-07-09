const { DataTypes } = require('sequelize');

const PoliceTracking = (sequelize) => {
    const PoliceTracking = sequelize.define('police_tracking', {
        track_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        theft_log_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'theft_logs', // Reference to the 'theft_logs' table
                key: 'log_id',
            },
            allowNull: false, // Required field
        },
        resolved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, // Default to false (not resolved)
            allowNull: false, // Required field
        },
        resolved_timestamp: {
            type: DataTypes.DATE,
            allowNull: true, // Optional, only set when the case is resolved
        },
    }, {
        tableName: 'police_tracking',
        timestamps: false, // Disable timestamps if not needed
    });

    return PoliceTracking;
};

module.exports = PoliceTracking;
