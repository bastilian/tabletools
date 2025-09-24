const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');

const initialise = () => {
  database.exec(`
    CREATE TABLE data(
      key INTEGER PRIMARY KEY,
      value TEXT
    ) STRICT
  `);
};

const query = (sql) => {
  const dbQuery = database.prepare('SELECT * FROM data ORDER BY key');

  console.log(dbQuery.all());
};

export default {
  initialise,
  query,
};
