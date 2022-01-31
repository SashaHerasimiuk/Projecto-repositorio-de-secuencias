var express = require('express');
var router = express.Router();
var users = require('../models/users');
var logs = require('../models/changelog');
router.get('/', function(req, res, next){
	res.render('createUser',{
		layout:'layout'
	});
})


router.post('/', async (req, res, next)=>{
	try {
		var username = req.body.username;
		var password = req.body.password;
		var time = require('moment')().format('YYYY-MM-DD HH-mm-ss');
		if (username == '' || password == '' || email == '') {
			await logs.createLog(ip,username, 'attempted to create an account with some empty camp');
			res.render('createUser',{
					layout:'layout',
					error:true,
					message:'all camps must be filled'
				});
		}else{
			obj = (await users.createUser(username, password, email));
			if (obj[0]) {
				await logs.createLog(ip,username, 'attempted to create an account with a taken username or email');
				res.render('createUser',{
				error:true,
				message:obj[1]
			})
			}else{
				await logs.createLog(ip,username, 'user created');
				res.redirect('/login');
		}
	}
		
	}catch (error){
		console.log(error);
		throw error;
	}
});

module.exports = router;