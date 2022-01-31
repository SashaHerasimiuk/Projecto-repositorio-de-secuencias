var pool = require('./dataBase');
async function createLog(ip, username, change){
	console.log(ip);
	var query = 'insert into changelog (time, ip, username, changes) values (?, ?, ?, ?)';
	var time = require('moment')().format('YYYY-MM-DD HH-mm-ss');
	await pool.query(query, [time, ip.substring('::ffff:'.length), username, change]);
}

async function getLogs(){
	var query = 'select * from changelog order by time desc';
	var rows = await pool.query(query);
	return rows;
}

module.exports = {createLog, getLogs}