let express = require('express');

let router = express.Router()
let app = express()


router.get('/', function(req, res, next){
    res.render('logup',{
		title:'注册',
		arr:[{sch:'',lib:'',abt:'active',log:''}]
    });
})

router.post('/', function(req, res, next){
	res.redirect('/login');
})

module.exports = router

