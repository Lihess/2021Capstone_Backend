require("dotenv")
const nodemailer = require('nodemailer');

// 메일 설정
const mailSender = {
    sendMail : async(toEmail, subject, html) => {
        var transporter = nodemailer.createTransport({
            service : 'gmail',
            prot: 587,
            host: 'smtp.gmlail.com',  
            secure: false,
            auth : {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PWD
            }});
        
        var mailOptions = {
            from : `"Better Before" <${process.env.MAIL_USER}> `,
            to : toEmail,
            subject : subject,
            html : html
        };

        await transporter.sendMail(mailOptions)
            .then((result) => { 
                console.log(result)
                return { result : result }})
            .catch((err) => {
                console.log(err)
                return { err : err}})
    }
}

module.exports = mailSender;