var router = require('express').Router();
var users = require('../../models/users');
var admins = require('../../models/admins');
var handlebars = require('hbs');
var logs = require('../../models/changelog');


handlebars.registerHelper('if_admin',function(user){
  if (admins.proveAdmin(user)) {
  	return true;
  }else{
  	return false;
  }
});


router.get('/', async (req, res, next)=>{
	var user = await users.getUsers();
	for (var i = 0; i <= user.length-1;i++) {
		var status = await admins.proveAdmin(user[i].username);
		user[i].admin=status;
	}
	res.render('admin/makeAdmin',{
		user
	});
});



router.post('/makeAdmin', async (req, res, next)=>{
	var username = req.body.username;
	var status = req.body.adminStatus;
	console.log(status);
	if (req.session.admin) {
		console.log(status);
		if (status == 'true') {
			await logs.createLog(ip,req.session.username, 'revoked admin of '+username);
			await admins.revokeAdmin(username);
		}else if (status == 'false'){
			await logs.createLog(ip,req.session.username,'made '+username+' admin');
			await admins.makeAdmin(username);
		}
	}else{
		redirect('/');
	}
	res.redirect('/admin/makeAdmin');
})

module.exports = router;