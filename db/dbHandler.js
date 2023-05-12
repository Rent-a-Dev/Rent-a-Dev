import {
  db,
} from './dbConfig.js';

export const dbHandler = () => {

  //TODO
  const insertNewDeveloper = () => {

    let sql = `INSERT INTO developers (
      first_name,
      last_name,
      available,
      team_id
      VALUES (\"Nicholas\", \"Joannou\", 0, 1)`;

    db.run(
      sql,
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log('Record inserted');
      });
  };

  const getDevelopers = () => {

    let sql = 'SELECT * FROM developers';

    db.each(sql, function (err, row) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`${row.developer_id}   ${row.first_name}`);
    });
  };

  return {
    insertNewDeveloper,
    getDevelopers,
  };
};