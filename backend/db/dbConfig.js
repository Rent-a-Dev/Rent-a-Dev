require('dotenv').config();
const mysql = require('mysql');

const {
  HOST,
  DBPORT,
  USER,
  PASSWORD,
  DATABASE,
} = process.env;

let db = mysql.createConnection({
  host: HOST,
  port: DBPORT,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = {
  db,
};