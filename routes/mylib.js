var express = require('express');
var router = express.Router();
var Borrow=require('../models/borrow');

//当前借阅
router.get('/myborrow',ensureAuthenticated,function(req,res,next){
	var readerId=res.locals.user.readerId;
	Borrow.findNowBorrow(readerId,function(err,borrows){
		if(err){
			return next(err);
		}
		//修正日期数据
		borrows.forEach(function(borrow){
			var outdate=borrow.outdate;
			//格式化借阅日期
			borrow.outdate=outdate.toLocaleDateString();//格式化为yy-mm-dd
			//计算应还日期
			//此处indate和数据库中的indate不是一样的，
			//这里代表应还日期，数据库中的indate是实际归还日期
			outdate.setMonth(outdate.getMonth()+1);
			if(borrow.frequency!=0){//续借次数不为0
				outdate.setDate(outdate.getDate()+10*borrow.frequency);
				borrow.indate=outdate.toLocaleDateString();
			}else{//续借次数为0
				borrow.indate=outdate.toLocaleDateString();
			}
		});
		res.render('myborrow',{
			title:'当前借阅-我的图书馆',
			arr:[{sch:'',lib:'active',abt:'',log:''}],
			borrows:borrows
		});
	});
});

//还书
router.post('/return',ensureAuthenticated,function(req,res,next){
	var bookcode=req.body.barcode;
	var readerId=res.locals.user.readerId;
	Borrow.returnBook(readerId,bookcode,function(err){
		if(err){
			return next(err);
		}
		res.render('result_return',{
			title:'还书结果-我的图书馆',
			arr:[{sch:'',lib:'active',abt:'',log:''}]
		});
	});
});

//续借
router.post('/renew',ensureAuthenticated,function(req,res,next){
	var bookcode=req.body.barcode;
	console.log('barcode',bookcode);
	var readerId=res.locals.user.readerId;
	Borrow.renew(readerId,bookcode,function(err){
		if(err){
			return next(err);
		}
		res.render('result_renew',{
			title:'续借结果-我的图书馆',
			arr:[{sch:'',lib:'active',abt:'',log:''}]
		});
	});
});


//借阅历史
router.get('/history',ensureAuthenticated,function(req,res,next){
	var readerId=res.locals.user.readerId;
	Borrow.findHistory(readerId,function(err,rows){
		if(err){
			return next(err);
		}
		rows.forEach(function(row){
			row.indate=row.inDate.toLocaleDateString();
			row.outdate=row.outDate.toLocaleDateString();//格式化时间
		});
		res.render('history',{
			title:'借阅历史-我的图书馆',
			arr:[{sch:'',lib:'active',abt:'',log:''}],
			books:rows
		});
	});
});


//证件信息
router.get('/info',ensureAuthenticated,function(req,res){
	var userInfo=res.locals.user;
	if(userInfo.sex=='m'){
		userInfo.sex='男';
	}else{
		userInfo.sex='女';
	}
	res.render('info',{
		title:'读者信息-我的图书馆',
		arr:[{sch:'',lib:'active',abt:'',log:''}],
		info:userInfo
	});
});

//登录认证
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}

module.exports = router;