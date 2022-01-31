var pool = require('./dataBase');

async function createSolution(requester, secuence, solve){
	try {
		var query = 'insert into solutions (requester, secuence, solveTry) values (?, ?, ?);';
		var insert = pool.query(query, [requester, secuence, solve]);
	}catch (error){
		console.log(error);
		throw error;
	}
}

async function getRecents(){
	try{
		var query = 'select * from solutions order by solution_id desc';
		var rows = pool.query(query);
	}catch (error){
		console.log(error);
		throw error;
	}
}

async function getSolves(secuence){
	try{
		var query = 'select * from solutions where secuence = ? order by solution_id';
		var rows = pool.query(query,[secuence]);
		return rows;
	}catch (error){
		console.log(error);
		throw error;
	}
}





module.exports = {createSolution, getRecents, getSolves}