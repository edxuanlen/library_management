let express = require('express');
let router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');
let Book = require('../models/book');
let Borrow = require('../models/borrow');
let crypto = require('crypto');
let mysql = require('mysql');

let app = express();

// 分发路由


// app.use('/logup', require('./logup'))



function cryptoPwd(password) {
	let md5 = crypto.createHash('md5');
	return md5.update(password).digest('hex');
}


//跳转搜索页
router.get('/', function (req, res) {
	res.redirect('/search');
});

//获取书目检索页
router.get('/search', function (req, res) {
	res.render('search', {
		title: '书目检索-图书流通管理系统',
		arr: [{ sch: 'active', lib: '', abt: '', log: '' }]
	});
});

//处理书目检索请求
router.get('/search/r', function (req, res, next) {
	let searchType = req.query.sType;//搜索类型
	let bookType = req.query.bType;//书籍类型
	let content = req.query.content;//搜索内容
	// console.log('content',content);

	if (searchType == 0)
		Book.findBooksByTitle(content, function (err, books) {
			if (err) {
				return next(err);//使用return XXX 的写法是为了在发错误时不会出现res重复响应状况
			}
			books.forEach(function (book) {
				if (book.type == 0) {
					book.type = '中文图书';
				}
			});
			res.render('result', {
				title: '搜索结果-图书流通管理系统',
				arr: [{ sch: 'active', lib: '', abt: '', log: '' }],
				books: books,
			});
		});
	if (searchType == 1)
		Book.findBooksByAuthor(content, function (err, books) {
			if (err) {
				return next(err);
			}
			books.forEach(function (book) {
				if (book.type == 0) {
					book.type = '中文图书';
				}
			});
			res.render('result', {
				title: '搜索结果-图书流通管理系统',
				arr: [{ sch: 'active', lib: '', abt: '', log: '' }],
				books: books,
			});
		});
	if (searchType == 2)
		Book.findBooksByisbn(content, function (err, books) {
			if (err) {
				return next(err);
			}
			books.forEach(function (book) {
				if (book.type == 0) {
					book.type = '中文图书';
				}
			});
			res.render('result', {
				title: '搜索结果-图书流通管理系统',
				arr: [{ sch: 'active', lib: '', abt: '', log: '' }],
				books: books,
			});
		});
	if (searchType == 3)
		Book.findBooksByPress(content, function (err, books) {
			if (err) {
				return next(err);
			}
			books.forEach(function (book) {
				if (book.type == 0) {
					book.type = '中文图书';
				}
			});
			res.render('result', {
				title: '搜索结果-图书流通管理系统',
				arr: [{ sch: 'active', lib: '', abt: '', log: '' }],
				books: books,
			});
		});

});

//获得书籍详情
router.get('/books', function (req, res, next) {
	let isbn = req.query['isbn'];
	Book.findBooksByISBN(isbn, function (err, bookInfo, booksState) {
		if (err) {
			return next(err);
		}

		let isOrder = true;
		booksState.forEach(function (book) {
			if (book.state == 0) {
				book.state = '可借';
				book.isBorrow = '<a href="/borrow?bookcode=' + book.bookcode + '">借阅</a>';
				isOrder = false;
			} else if (book.state == 1) {
				book.state = '借出';
				book.isBorrow = '此书已借出';
			} else if (book.state == 2) {
				book.state = '遗失';
				book.isBorrow = '遗失';
			}
		});


		res.render('books', {
			title: '书目信息-图书流通管理系统',
			arr: [{ sch: 'active', lib: '', abt: '', log: '' }],
			bookInfo: bookInfo,
			booksState: booksState,
			isOrder: isOrder
		});
	});
});

//跳转借书界面
router.get('/borrow', ensureAuthenticated, function (req, res, next) {
	let bookcode = req.query['bookcode'];
	Book.findBookBybarcode(bookcode, function (err, book) {
		if (err) {
			return next(err);
		}
		res.render('borrow', {
			title: '借阅-图书流通管理系统',
			arr: [{ sch: 'active', lib: '', abt: '', log: '' }],
			book: book
		});
	});
});

//提交借书请求
router.post('/borrow', ensureAuthenticated, function (req, res, next) {
	let bookcode = req.body.barcode;//书籍条码号
	let readerId = res.locals.user.readerId;//读者证件号
	Borrow.save(readerId, bookcode, function (err) {
		if (err) {
			return next(err);
		}
		res.render('result_borrow', {
			title: '借阅结果-图书流通管理系统',
			arr: [{ sch: 'active', lib: '', abt: '', log: '' }]
		});
	});
});

//获取登录页
router.get('/login', function (req, res) {
	res.render('login', {
		title: '登录-图书流通管理系统',
		arr: [{ sch: '', lib: 'active', abt: '', log: '' }]
	});
});

//提交登录请求
router.post('/login', function (req, res, next) {
	let referer = req.body.referer;
	console.log(referer , "!!!");

	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			req.flash('error_msg', info.message);
			return res.redirect('/login');
		}
		// console.log(user)
		req.logIn(user, function (err) {//这里内部会调用passport.serializeUser()

			if (err) {
				return next(err);
			}
			req.flash('success_msg', '登录成功...');
			// console.log("??!!!!")
			if (referer != 'http://127.0.0.1:3000/login') {
				return res.redirect(referer);
			}
			// console.log('ress');
			return res.redirect('/mylib/myborrow');
		});
	})(req, res, next);
});

passport.use(new LocalStrategy(
	function (username, password, done) {//username即数据库表中的readerId
		User.findUserByreaderId(username, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: '找不到用户名' });
			}
			if (user.password != cryptoPwd(password)) {
				return done(null, false, { message: '密码匹配有误!' });
			}
			// console.log(user)
			return done(null, user);
		});
	})
);

// serializeUser 在用户登录验证成功以后将会把用户的数据存储到 session 中（在这里
// 存到 session 中的是用户的 username）。在这里的 user 应为我们之前在 new
// LocalStrategy (fution() { ... }) 中传递到回调函数 done 的参数 user 对象（从数据// 库中获取到的）
passport.serializeUser(function (user, done) {
	// console.log(user.readerId);
	done(null, user.readerId);
});

// deserializeUser 在每次请求的时候将会根据用户名读取 从 session 中读取用户的全部数据
// 的对象，并将其封装到 req.user
passport.deserializeUser( async (username, done) => {
	if(username == 'root')
		username = "250"
	let sql = "select * from reader where id = ? ";
	let inserts = [username];
	sql = mysql.format(sql, inserts);
	console.log(sql)
	let res = await query(sql)
	if (res[0] && "email" in res[0] )
		User.findUserByreaderId(res[0].email, function (err, user) {
			// console.log(email)
			done(err, user);
		});
});

//退出登录
router.get('/loginOut', function (req, res) {
	req.logout();
	res.redirect('/login');
});

//admin
router.get('/admin', function (req, res) {
	res.render('admin', {
		title: '管理员界面',
		arr: [{ sch: '', lib: '', abt: 'active', log: '' }]
	});
});

router.get('/addbook', function (req, res) {
	res.render('addbook', {
		title: '添加书籍',
		arr: [{ sch: '', lib: '', abt: 'active', log: '' }]
	});
});

var db = require('../models/dbhelper');
var query = require('../models/database').query
router.post('/addbook', function (req, res, next) {

	let isbn = req.body.isbn;
	let title = req.body.title;
	let author = req.body.author;
	let type = req.body.type;
	let press = req.body.press;
	let comment = req.body.comment;

	let sql = "insert into book value (?, ?, ?, ?, ?, ?)";
	let insert = [isbn, title, author, type, press, comment];
	sql = mysql.format(sql, insert);
	// console.log(sql);

	db.exec(sql, '', function (err, rows) {
		if (err) {
			console.log(err);
		}
	});
	// res.send(null,true,{message:'添加成功'});
	res.redirect('/');
});

router.get('/change', async (req, res) => {
	let sql = "select bk.isbn, bk.title, bk.author, bk.type, bk.press, bk.content, ib.bookcode, ib.state from book bk ,isbn_bookcode ib where bk.isbn = ib.isbn and ib.bookcode in( select bookcode from isbn_bookcode)";
	let data;
	db.exec(sql, '', function (err, rows) {
		if (err) {
			console.log(err);
		}
		// console.log(rows)
		rows = JSON.parse(JSON.stringify(rows))
		// console.log(rows);
		res.render('change', {
			title: '书本数量',
			data: rows,
			arr: [{ sch: '', lib: '', abt: 'active', log: '', }]
		});
	});
});

router.post('/change', function (req, res, next) {

	let checkbox = req.body.checkbox;
	let sql = "delete from isbn_bookcode where bookcode = ?";
	let insert = [checkbox];
	sql = mysql.format(sql, insert);
	// console.log(sql);
	db.exec(sql, '', function (err, rows) {
		if (err) {
			console.log(err);
		}
	});
	// res.send(null,true,{message:'添加成功'});
	res.redirect('/');
});

router.post('/infochange', function (req, res, next) {

	// let checkbox = req.body.checkbox;
	let readerId = req.body.readerId;
	let name = req.body.name;
	let sex = req.body.sex;
	let creditNum = req.body.creditNum;
	let phone = req.body.phone;
	let email = req.body.email;
	let maxBorrow = req.body.maxBorrow;

	// console.log(req.user.id);
	// UPDATE table_name
	// SET column1=value1,column2=value2,...
	// WHERE some_column=some_value;

	let sql = "update reader set name = ?, sex = ?, creditNum = ?, phone = ?, email = ? , maxBorrow = ? where readerId = ?";
	let insert = [name, sex, creditNum, phone, email, maxBorrow, readerId];
	sql = mysql.format(sql, insert);
	// console.log(sql);
	db.exec(sql, '', function (err, rows) {
		if (err) {
			console.log(err);
		}
	});
	// res.send(null,true,{message:'修改成功'});
	res.redirect('/mylib/info');
});


//登录验证
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/login');
	}
}




module.exports = router;



// app.listen(3000);