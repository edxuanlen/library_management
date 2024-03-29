//nodemailer.js
const nodemailer = require('nodemailer');
const config = require('../config/defaults');

//创建一个smtp服务器

// console.log(config);
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config.mail_config);

//发送邮件
module.exports = function (mail){
    transporter.sendMail(mail, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response);
    });
};

