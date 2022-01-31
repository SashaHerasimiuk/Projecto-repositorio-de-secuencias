var pool = require('./dataBase');
var md5 = require('md5');
var admin = require('./admins.js');

async function createUser(username, password, email){
	try {
		var proveName = await usernameTaken(username);
		var proveEmail = await emailTaken(email);
		if (proveName){
			console.log('1');
			return [true, 'username taken'];
			
		}else if(proveEmail){
			console.log('2');
			return [true, 'email taken'];

		}else{
			var query = 'insert into users (username, password, email) values (?, ?, ?)';
			var rows = await pool.query(query,[username, md5(password), email]);
			return [false,''];
		}
	}catch (error){
		console.log(error);
		throw error;
	}
}

async function emailTaken(email){
	try	{
		var query = 'select * from users where email = ?';
		var prove = pool.query(query, [email]);
		if ((await prove).length== 0 ) {
			return false
		}else{
			return true
		}	
	}catch (error){
		console.log(error);
		throw error;
	}
}

async function usernameTaken(username){
	try {
		var query = 'select * from users where username = ?';
		var prove = pool.query(query, [username]);
		if ((await prove).length == 0){
			return false
		}else{
			return true
		}
	}catch (error){
		console.log(error);
		throw error;
	}
}

async function getUser(user, password){
	try {
		var query = 'select * from users where username = ? and password = ? limit 1';
		var rows = await pool.query(query, [user, md5(password)]);
		return rows[0];
	}catch(error){
		console.log(error);
		throw error;
	}
}

async function getUsers(){
	try	{
		var query = 'select username, email from users';
		return await pool.query(query);
	}catch (error){
		console.log(error);
		throw error;
	}
}



module.exports ={createUser, getUser, usernameTaken , emailTaken, getUsers}