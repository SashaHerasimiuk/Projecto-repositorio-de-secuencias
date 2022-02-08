var pool = require('./dataBase');

async function createSecuence(name, secuence, description){
	try{ 
		var query = 'insert into secuences (requester, secuence, description) values (?, ?, ?)';
		var rows = await pool.query(query,[name, secuence, description]);
		return false;
	}catch (error){
		console.log(error);
		return true;
	}
}


async function getSecuences(){
	try{
		var query = 'select * from secuences order by secuence_id desc';
		var rows = await pool.query(query);
		return rows;
	}catch(error){
		console.log(error);
		throw error;
	}
}
async function getSecuence(id){
	try{
		var query = 'select secuence from secuences where id = ? limit 1';
		var row = await pool.query(query, [id]);		
	}catch (error){
		console.log(error);
		throw error;
	}
}

async function deleteSecuence(secuence){
	try {
		var query = 'delete from secuences where secuence = ?';
		await pool.query(query,[secuence]);
	}catch (error){
		console.log(error);
		throw error;
	}
}

async function selectSolution(secuence, solution){
	try{
		var query = 'update secuences set solution = ? where secuence = ?';
		await pool.query(query, [solution, secuence]);
	}catch	(error){
		console.log(error);
		throw error;
	}
}


module.exports = {createSecuence, getSecuence, getSecuences, deleteSecuence, selectSolution}