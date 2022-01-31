var express = require('express');
var router = express.Router();

var secuences = require('../../models/secuences');
var solutions = require('../../models/solutions');
var logs = require('../../models/changelog');
var secuence = '';

router.get('/', async (req, res, next)=>{
	var username = req.session.usename;
	secuence = req.query.secuence;
	var log = await solutions.getSolves(secuence);
	res.render('admin/solve', {
		log,
		username:username,
		secuence:secuence
	})
});

router.post('/solve', async (req, res, next)=>{
	var username = req.session.username;
	var solveTry = req.body.solution;
	if (secuence != '' && solveTry != 'f(x)=') {
		await logs.createLog(ip,username, 'send  '+ secuence +'solve:' + solveTry);
		await solutions.createSolution(username, secuence, solveTry);
		res.redirect(303, '/admin/connected');
	}else {
		await logs.createLog(ip,username,'send empty solveTry');
		res.render('admin/solve',{
			error:true,
			message:'cant be empty'
		});
	}	
});

router.post('/solution', async (req, res, next)=>{
	var username = req.session.username;
	var solution = req.body.solution;
	secuence = req.body.secuence;
	await logs.createLog(ip,username, 'solved '+secuence+':'+solution);
	await secuences.selectSolution(secuence, solution);
	res.redirect(303, '/admin/connected');
})

module.exports = router;