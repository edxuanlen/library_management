var db=require('./dbhelper');

//book类
function Book(){
	this.isbn;
	this.bookcode;
	this.title;
	this.author;
	this.type;
	this.press;
	this.price;
	this.content;
	// this.catalog;
	// this.callNumber;
	// this.address;
	this.state;
}

module.exports=Book;

//保存书籍信息--后台使用的方法
Book.prototype.save = function() {
	var sql="";
};

//根据书名查找书
Book.findBooksByTitle=function(title,callback){
	var sql="SELECT isbn,title,author,type,press FROM book WHERE title LIKE '%"+title+"%';";
	db.exec(sql,'',function(err,rows){
		if(err){
			return callback(err);
		}
		callback(err,rows);
	});
};
Book.findBooksByAuthor=function(author,callback){
	var sql="SELECT isbn,title,author,type,press FROM book WHERE author LIKE '%"+author+"%';";
	console.log(sql);
	db.exec(sql,'',function(err,rows){
		if(err){
			return callback(err);
		}
		callback(err,rows);
	});
};
Book.findBooksByisbn=function(isbn,callback){
	var sql="SELECT isbn,title,author,type,press FROM book WHERE isbn LIKE '%"+isbn+"%';";
	db.exec(sql,'',function(err,rows){
		if(err){
			return callback(err);
		}
		callback(err,rows);
	});
};
Book.findBooksByPress=function(press,callback){
	var sql="SELECT isbn,title,author,type,press FROM book WHERE press LIKE '%"+press+"%';";
	db.exec(sql,'',function(err,rows){
		if(err){
			return callback(err);
		}
		callback(err,rows);
	});
};


//根据isbn查找书籍
Book.findBooksByISBN=function(isbn,callback){
	db.getConnection(function(err,connection){
		if(err){
			return callback(err);
		}
		var sql;
		connection.beginTransaction(function(err){
			if(err){
				return callback(err);
			}
			sql="SELECT isbn,title,author,content,press FROM book WHERE isbn='"+isbn+"';";
			connection.query(sql,[],function(err,rows){
				if(err){
					return connection.rollback(function(){
						callback(err);
					});
				}
				var bookInfo=rows[0];//图书基本信息

				sql="SELECT ib.bookcode,ib.state FROM book bk,isbn_bookcode ib WHERE ib.isbn='"+isbn+"' AND bk.isbn=ib.isbn;";
				connection.query(sql,[],function(err,rows){
					if(err){
						return connection.rollback(function(){
							callback(err);
						});
					}
					var booksState=rows;//图书馆藏情况

					connection.commit(function(err){
						if(err){
							return connection.rollback(function(){
								callback(err);
							});
						}
						connection.end();
						callback(undefined,bookInfo,booksState);
					});
				});
			});
		});
	});
};


//根据bookcode查找书籍
Book.findBookBybarcode=function(bookcode,callback){
	var sql="SELECT bk.title,ib.bookcode,bk.author,bk.press FROM book bk,isbn_bookcode ib WHERE bookcode='"+bookcode+"' AND bk.isbn=ib.isbn;";
	db.exec(sql,'',function(err,rows){
		if(err){
			callback(err);
		}
		callback(err,rows[0]);
	});
};