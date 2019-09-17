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
	let sql = "select * from reader where email = ? ";
	let inserts = [readerId];
	sql = mysql.format(sql, inserts);
	// console.log(sql)
	// console.log("AGAIN")
	db.exec(sql,'',function(err,rows){
		if(err){
			return callback(err);
		}
		if( rows[0] && ("id" in rows[0]) ){

			if(rows[0].id == 250) rows[0].id = 0;
			console.log(rows)
			callback(err,rows[0]);
		}
	});
};


