var db = require('./dbhelper');
let mysql = require('mysql')

function Borrow(readerId, bookcode) {
	this.readerId = readerId;
	this.bookcode = bookcode;
}

module.exports = Borrow;

//保存借书记录
Borrow.save = function(readerId, bookcode, callback) {
	db.getConnection(function(err,connection){
		if(err){
			return callback(err);
		}
		let insert;
		let sql;
		connection.beginTransaction(function(err){
			if(err){
				return callback(err);
			}
			// sql="SELECT isbn FROM isbn_bookcode WHERE bookcode='"+bookcode+"';";
			sql="SELECT isbn FROM isbn_bookcode WHERE bookcode = ?;";
			insert = [bookcode];
			sql = mysql.format(sql, insert);


			console.log(sql);


			connection.query(sql,[],function(err, rows){
				if(err){
					return connection.rollback(function(){
						callback(err);
					});
				}
				console.log(rows);
				var isbn=rows[0].isbn;

				sql = "UPDATE isbn_bookcode SET state=1 WHERE bookcode='" + bookcode + "';";
				connection.query(sql,[],function(err,rows){
					if(err){
						return connection.rollback(function(){
							callback(err);
						});
					}

					var date = new Date().Format("yyyy-MM-dd hh:mm:ss");//借书日期
					sql = "INSERT INTO borrow (readerId,isbn,bookcode,outdate) VALUES ('" + readerId + "','" + isbn + "','" + bookcode + "','"+date+"');";
					connection.query(sql,[],function(err,rows) {
						if(err){
							return connection.rollback(function(){
								callback(err);
							});
						}
						connection.commit(function(err){
							if(err){
								return connection.rollback(function(){
									callback(err);
								});
							}
							connection.end();
							callback();
						});
					});
				});
			});
		});
	});
};

//当前借阅
Borrow.findNowBorrow=function(readerId,callback){
	var sql="SELECT bw.bookcode,bk.title,bk.author,bw.outdate,bw.frequency FROM borrow bw,book bk WHERE bw.isbn=bk.isbn AND readerId='"+readerId+"' ORDER BY bw.outDate DESC;"
	db.exec(sql,'',function(err,rows){
		if(err){
			return callback(err);
		}
		callback(err,rows);
	});
}

//还书
Borrow.returnBook=function(readerId,bookcode,callback){
	db.getConnection(function(err,connection){
		if(err){
			return callback(err);
		}
		var sql;
		connection.beginTransaction(function(err){
			if(err){
				return callback(err);
			}

			//更改isbn_bookcode中state状态为'可借'
			sql="UPDATE isbn_bookcode SET state=0 WHERE bookcode='"+bookcode+"';";
			connection.query(sql,[],function(err){
				if(err){
					return connection.rollback(function(){
						callback(err);
					});
				}

				sql="SELECT outDate FROM borrow WHERE readerId='"+readerId+"' AND bookcode='"+bookcode+"';";
				connection.query(sql,[],function(err,rows){
					if(err){
						return connection.rollback(function(){
							callback(err);
						});
					}

					var outDate=(rows[0].outDate).Format("yyyy-MM-dd hh:mm:ss");//借阅日期
					console.log('outDate',outDate);
					var inDate = new Date().Format("yyyy-MM-dd hh:mm:ss");//还书日期
					sql="INSERT INTO history VALUES('"+readerId+"','"+bookcode+"','"+outDate+"','"+inDate+"')";
					connection.query(sql,[],function(err){
						if(err){
							return connection.rollback(function(){
								callback(err);
							});
						}

						//删除借阅表中的记录
						sql="DELETE FROM borrow WHERE readerId='"+readerId+"' AND bookcode='"+bookcode+"';";
						connection.query(sql,[],function(err,rows){
							if(err){
								return connection.rollback(function(){
									callback(err);
								});
							}
							connection.commit(function(err){
								if(err){
									return connection.rollback(function(){
										callback(err);
									});
								}
								connection.end();
								callback();
							});
						});
					});
				});
			});
		});
	});
};

//续借
Borrow.renew=function(readerId,bookcode,callback){
	db.getConnection(function(err,connection){
		if(err){
			return callback(err);
		}
		var sql;
		connection.beginTransaction(function(err){
			if(err){
				return callback(err);
			}
			sql="SELECT frequency FROM borrow WHERE readerId='"+readerId+"' AND bookcode='"+bookcode+"';";
			connection.query(sql,[],function(err,rows){
				if(err){
					return connection.rollback(function(){
						callback(err);
					});
				}

				var frequency=rows[0].frequency;

				if(frequency==0){
					frequency=1;
				}else if(frequency==1){
					frequency=2;
				}else{
					return callback('续借不能超过2次！')
				}
				var sql="UPDATE borrow SET frequency="+frequency+" WHERE readerId='"+readerId+"' AND bookcode='"+bookcode+"'";
				connection.query(sql,[],function(err,rows){
					if(err){
						return connection.rollback(function(){
							callback(err);
						});
					}

					connection.commit(function(err){
						if(err){
							return connection.rollback(function(){
								callback(err);
							});
						}
						callback();
					});	
				});
			});
		});
	});
};

//历史借阅
Borrow.findHistory=function(readerId,callback){
	var sql="SELECT ib.bookcode,bk.title,bk.author,his.outDate,his.inDate FROM history his,book bk,isbn_bookcode ib WHERE his.bookcode=ib.bookcode AND ib.isbn=bk.isbn AND readerId='"+readerId+"' ORDER BY his.inDate DESC;"
	db.exec(sql,'',function(err,rows){
		if(err){
			return callback(err);
		}
		callback(err,rows);
	});
};

//格式化日期时间
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, 
		"d+": this.getDate(), 
		"h+": this.getHours(), 
		"m+": this.getMinutes(), 
		"s+": this.getSeconds(), 
		"q+": Math.floor((this.getMonth() + 3) / 3), 
		"S": this.getMilliseconds() 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}