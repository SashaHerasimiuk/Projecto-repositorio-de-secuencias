var express = require('express');
var router = express.Router();
var logs = require('../../models/changelog');
var secuences = require('../../models/secuences');
var logs = require('../../models/changelog');


router.get('/', async function(req, res, next){
	var secuenceLog = await secuences.getSecuences();
	var changelog = await logs.getLogs();
	var form = false;
	res.render('admin/connected',{
		username:req.session.username,
		secuenceLog,
		changelog,
		form
	});
});


router.get('/createSecuence', async (req, res, next)=>{
	if (req.query.terms < 4 || req.query.terms == undefined) {
		await logs.createLog(ip, req.session.username,'tried to create a secuence of less than 4 or undefined size terms');
		var secuenceLog = await secuences.getSecuences();
			var changelog = await logs.getLogs();
			var form = false;
			res.render('admin/connected',{
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
		var secuenceLog = await secuences.getSecuences();
		var changelog = await logs.getLogs();
		res.render('admin/connected',{
			changelog,
			secuenceLog,
			form,
			terms,
			terminos,
			username:req.session.username
		});
	}
})

router.post('/delete', async function(req, res, next){
	await logs.createLog(ip, req.session.username,'deleted the secuence ' + req.body.secuence);
	await secuences.deleteSecuence(req.body.secuence);
	res.redirect('/admin/connected');
})

router.post('/requestSecuence', async function(req, res, next){
	var toJoin = req.body.term;
	var terms = req.body.terms;
	var error = false
	var description = req.body.description;
	for (var i = 0; i < toJoin.length ; i++){
		if (toJoin[i] == '') {
			error = true;
		}
	}
	if (error) {
		var secuenceLog = await secuences.getSecuences();
		var form = false;
		var changelog = await logs.getLogs();
		await logs.createLog(ip, req.session.username,'sent an empty secuence');
		res.render('admin/connected',{
			changelog,
			username:req.session.username,
			secuenceLog,
			form,
			error:true,
			message:'one or more camps were empty'
		});
	}else{
		var secuence = toJoin.join();
		if (secuence != '') {
			await logs.createLog(ip,req.session.username,'requested secuence '+ secuence);
			if (await secuences.createSecuence(req.session.username, secuence, description)) {
				var secuenceLog = await secuences.getSecuences();
				var changelog = await logs.getLogs();
				var form = false;
				res.render('admin/connected',{
					username:req.session.username,
					secuenceLog,
					changelog,
					form,
					error:true,
					message:'the secuence is already on the database'
		});
			}else{
				res.redirect('/admin/connected');
			}
			
			
		}else{
			await logs.createLog(ip, req.session.username,'tried to create an empty secuence');
			res.redirect('/admin/connected');
		}
	}
});


router.get('/logout', async function(req, res, next){
	var username = req.session.username;
	await logs.createLog(ip,username, 'logged out');
	req.session.destroy();
	res.redirect('../../login');
})



module.exports = router;