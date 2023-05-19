let mysql = require('mysql');

let db = mysql.createConnection({
  host: "rent-a-dev-mydb-mlm8gyowdhvd.cdpckwejswol.us-east-1.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "WeLoveJavaScript",
  database: 'rentadev',
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = {
  db,
};