var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "MysqlBBDWaffles123",
  database: 'rentadev',
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = {
  db,
};