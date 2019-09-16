var mysql = require('mysql');


config = {
    "mysql_info": {
    connectionLimit : 10,
    host: '120.79.224.142',
    port: 3306,
    user: 'root',
    password: '19980504',
    database: 'library'
    },
    "mail_config": {
        host: 'smtp.163.com',
        port: 465,
        auth: {
            user: 'edxuanlen@163.com', // 163邮箱账号
            pass: 'du88609723' // 邮箱的授权码
        }
    }
}
module.exports = config;
// module.exports=mysql_info ;