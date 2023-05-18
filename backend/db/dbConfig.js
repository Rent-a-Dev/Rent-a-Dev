const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./backend/db/rent-a-dev');

module.exports = {
  db,
};