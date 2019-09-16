const express = require('express')
const router = express.Router()
const query = require('../models/database').query
const mysql = require('mysql')
var bodyParser = require('body-parser');

// const checkNotLogin = require('../middlewares/check').checkNotLogin


const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var crypto = require('crypto');

function cryptPwd(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}



// app.use(bodyParser.urlencoded({extended: false}));
// app.configure(function(){
//   app.use(express.bodyParser());
//   app.use(app.router);
// });
// app.listen(3000);

// // GET /signup 注册页
// router.get('/', checkNotLogin, function (req, res, next) {
//   res.send('signup')
// })

// POST /signup 用户注册
// router.post('/', checkNotLogin, function (req, res, next) {
//   res.send('signup')
// })

router.post('/', async (req, res) => {

    // console.log(req);
    // console.log(req.body);
    var email = req.body.EmailNumber;
    var username = req.body.Name;//获取用户名
    var password = req.body.Password//获取密码
    var code = req.body.vcode;//获取你输入的验证码


    var sql = "select code from ?? where ?? = ?"
    var inserts = ['reader', 'email', email]
    sql = mysql.format(sql, inserts) // select * from reader where id = 1

    var result = await query(sql)    // console.log(result);

    result = result[0].code;

    // console.log(result)

    if (result != code) {
        // console.log(code == result)
        res.send("验证码错误")
    }
    else {
        sql = "update reader set ?? = ?, ?? = ? where ?? = ?"
        inserts = ['password', cryptPwd(password), 'isLive', 1, 'email', email]
        sql = mysql.format(sql, inserts);

        await query(sql);
        res.send("")
    }

});


module.exports = router