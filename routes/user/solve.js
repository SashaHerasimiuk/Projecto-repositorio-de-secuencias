var express = require('express');
var router = express.Router();

var solutions = require('../../models/solutions');
var logs = require('../../models/changelog');
var secuence = '';

router.get('/', async (req, res, next)=>{
	var username = req.session.usename;
	secuence = req.query.secuence;
	var log = await solutions.getSolves(secuence);
	res.render('user/solve', {
		log,
		username:username,
		secuence:secuence
	})
});

router.post('/solve', async (req, res, next)=>{
	var username = req.session.username;
	var solveTry = req.body.solution;
	await logs.createLog(ip,username,'solved '+secuence+':'+ solveTry);
	if (secuence != '' && solveTry != 'f(x)=') {
		await solutions.createSolution(username, secuence, solveTry);
		res.redirect(303, '/user/connected');
	}else {
		await logs.createLog(ip,username,'send empty solveTry');
		console.log('error');
		res.render('user/solve',{
			error:true,
			message:'cant be empty'
		});
	}
	
})

module.exports = router;