const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'burglaralarmsystem9@gmail.com',
        pass: 'cqmc mqlm hnct zxlk'
    }
});



module.exports={
    transporter,
}