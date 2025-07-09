const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt')


const UserModel = (sequelize) => {
    const User = sequelize.define('user', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        failed_logins: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        is_thief: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        tableName: 'users',
        timestamps: false, // Disable timestamps
    });

    // Hash password before saving the user
    User.beforeCreate((user) => {
        const saltRounds = 10;
        return new Promise((resolve, reject) => {
            bcrypt.hash(user.password_hash, saltRounds, (err, hashedPassword) => {
                if (err) {
                    return reject(new Error('Error hashing password'));
                }
                user.password_hash = hashedPassword;
                resolve();
            });
        });
    });

    return User;
};


  module.exports = UserModel;