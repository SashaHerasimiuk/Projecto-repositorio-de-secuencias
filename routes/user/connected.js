var express = require('express');
var router = express.Router();



var secuences = require('../../models/secuences');
var logs = require('../../models/changelog');



router.post('/requestSecuence', async (req, res, next)=>{
	var toJoin = [];
	var terms = req.body.terms;
	var error = false;
	toJoin = req.body.term;
	for (var i = 0; i < toJoin.length ; i++){
		if (toJoin[i] == '') {
			error = true;
		}
	}
	if (error) {
		var secuenceLog = await secuences.getSecuences();
		var form = false;
		await logs.createLog(ip,req.session.username,'sended empty secuence request');
		res.render('user/connected',{

			username:req.session.username,
			secuenceLog,
			form,
			error:true,
			message:'one or more camps were empty'
		});
	}else{
		var secuence = toJoin.join();
		if (secuence != '') {
			
			if (await secuences.createSecuence(req.session.username, secuence)) {
				await logs.createLog(ip,req.session.username,'requested repeated secuence '+ secuence);
				var secuenceLog = await secuences.getSecuences();
				var form = false;
				res.render('user/connected',{
					username:req.session.username,
					secuenceLog,
					form,
					error:true,
					message:'the secuence is already on the database'
				});
			}else{
				await logs.createLog(ip,req.session.username,'requested secuence '+ secuence);
				res.redirect('/user/connected');
			}
			
		}else{
			await logs.createLog(ip,req.session.username,'tried to create an empty secuence');
			res.redirect('/user/connected');
		}
	}
})

router.get('/createSecuence', async (req, res, next)=>{
	if (req.query.terms < 4 || req.query.terms == undefined) {
		var secuenceLog = await secuences.getSecuences();
		await logs.createLog(ip,req.session.username,'undefined or less than 4 number of terms');
			var changelog = await logs.getLogs();
			var form = false;
			res.render('user/connected',{
				username:req.session.username,
				secuenceLog,
				changelog,
				form,
				error:true,
				message:'undefined or less than 4 number of terms'
	});
	}else{
		var form = true;
		var terms = req.query.terms - 1;
		var terminos = [] ;
		
		for (var i = 0; i <= terms; i++) {
			terminos[i] = {term:i}
		}
		var username = req.session.username
		var secuenceLog = await secuences.getSecuences();
		res.render('user/connected',{
			username,
			secuenceLog,
			form,
			terms,
			terminos
		});
	}
})

router.get('/', async function(req, res, next){
	var secuenceLog = await secuences.getSecuences();
	var form = false;
	res.render('user/connected',{
		username:req.session.username,
		secuenceLog,
		form
	});
});



router.get('/logout', async function(req, res, next){
	var username = req.session.username;
	await logs.createLog(ip,username, 'logged out');
	req.session.destroy();
	res.redirect('/login');
});



module.exports = router;
