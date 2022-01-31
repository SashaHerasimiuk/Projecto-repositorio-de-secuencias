var express = require('express');
var router = express.Router();
require('dotenv').config();
var users = require('./../models/users');
var md5 = require('md5');
var session = require('express-session');
var bodyParser = require('body-parser');
var admins = require('./../models/admins');
var logs = require('./../models/changelog');
var sessionParser = session({
	secret:process.env.SECRET,
	saveUninitialized:true,
	resave:false
});

var jsonParser = bodyParser.json();
var urlparser = bodyParser.urlencoded({extended:false});

router.get('/', function(req, res, next){
	res.render('login', {
		layout:'layout'
	});
});

router.post('/',urlparser, sessionParser, async (req, res, next)=>{
	try{
		var user = req.body.user;
		var password = req.body.password;
		var data = await users.getUser(user, password);
		 if (data != undefined) {
			req.session.id_user = data.user_id;
			req.session.username = data.username;

			if(await admins.proveAdmin(user)){
		 		req.session.admin = true;
		 		res.redirect('/admin/connected');
			}else{
				res.redirect('/user/connected');
			}
			await logs.createLog(ip,req.session.username,'logged in');
		}else{
			res.render('login', {
				layout:'layout',
				error:true
			});
		}
	}catch (error){
		console.log(error);
	}
});


module.exports = router;