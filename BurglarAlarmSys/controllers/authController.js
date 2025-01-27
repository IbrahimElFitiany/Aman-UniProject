const { User } = require('../models/index');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/authMiddleware');
const nodemailer = require("../services/nodemailer")

const authController = {
    // Login user
    loginUser: async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Compare password with the stored hash
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                user.failed_logins += 1;
                await user.save();

                if (user.failed_logins >= 3){
                    await user.update({ is_thief: true });
                    const token = generateToken({ id: user.user_id, username: user.username ,isThief: user.is_thief});

                    //send email ll 45s eno bytsr2
                    const mailOptions = {
                        from: '"BAS" <burglarAlarmsystem9@example.com>',
                        to: `${user.email}`,
                        subject: 'EL72 EL BET BYTSR2',
                        text: 'feh 7ramy fl bet 3ndk 8albn'
                    };

                    nodemailer.transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log('Error:', error);
                        } else {
                            console.log('Email sent:', info.response);
                        }
                    });

                    return res.status(200).json({ message: 'Login successful', token});
                }
                return res.status(401).json({ error: 'Invalid credentials' });
            }


            user.failed_logins = 0;
            user.is_thief = false;
            user.save()

            const token = generateToken({ id: user.user_id, username: user.username,isThief: user.is_thief});

            res.status(200).json({ message: 'Login successful', user , token});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

};

module.exports = authController;
