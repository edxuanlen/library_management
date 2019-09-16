const express = require('express')
const router = express.Router()
const nodemail = require('../models/nodemailer')
const query = require('../models/database').query
const mysql = require('mysql')
let random = require('string-random')
router.get('/', async (req, res) => {
    var email = req.query.email;//刚刚从前台传过来的邮箱
    var name = req.query.name;//刚刚从前台传过来用户名
    var Num = "";
    for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    var code = Num;

    var sql = "use library";

    query(sql);
    // let dataList = await query( sql )

    sql = "select * from ?? where ?? = ?"
    var inserts = ['reader', 'email', email]
    sql = mysql.format(sql, inserts) // select * from users where id = 1

    var result = await query(sql)    // console.log(result);
    // console.log(result[0].isLive)


    // console.log(result)

    if (result.length > 0 && (result[0].isLive  == 1) ) {
        res.send("false");
        // console.log("false");
        // return ;
    } else {
        // console.log("OK");
        // res.send("true");//数据传回前台
        var mail = {
            // 发件人
            from: '<edxuanlen@163.com>',
            // 主题
            subject: '弢弢图书馆注册邮箱验证码',//邮箱主题
            // 收件人
            to: email,//前台传过来的邮箱
            // 邮件内容，HTML格式

            text: name + ' 你好' + '\n' + '您的验证码为: ' + code //发送验证码
        };
        readerId = random(10);
        sql = "insert into reader ( `readerId`, `name`,  `email`, `code` ) values   (?,  ?, ? , ?)"
        var inserts = [ readerId, name.toString(),  email.toString(), code]
        sql = mysql.format(sql,  inserts);

        console.log(sql);

        result = query(sql, function(err, res, fields) {} );

        sql = "update reader set ?? = ? where ?? = ?"
        inserts = ['code', code, 'email', email]
        sql = mysql.format(sql, inserts);

        // console.log();
        await query(sql);

        console.log(code);

        // await nodemail(mail);//发送邮件
        res.send("OK")

    }
})

module.exports = router
