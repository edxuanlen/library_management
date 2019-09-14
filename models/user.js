var fs=require('fs');
var querystring=require('querystring');
var db=require('./dbhelper');
var mysql = require('mysql')

function User(){
	this.readerId;
	this.password;
}

module.exports=User;

//根据证件号查找用户
User.findUserByreaderId=function(readerId, callback){
	// var sql="SELECT*FROM reader WHERE readerId='"+readerId+"';";
	let sql = "select * from reader where readerId = ? ";
	let inserts = [readerId];
	sql = mysql.format(sql, inserts);
	db.exec(sql,'',function(err,rows){
		if(err){
			return callback(err);
		}
		if(rows[0].id == 250) rows[0].id = 0;
		//rows是一个对象数组
		console.log(rows[0]);
		callback(err,rows[0]);
	});
};


