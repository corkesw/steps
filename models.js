const db = require("./db/connection");
// const format = require("pg-format");

exports.selectMonths = () => {
  return db.query("SELECT * FROM months").then((res) => {
    return res.rows;
  });
};

exports.insertMonth = (month, year, days, steps) => {
  return db
    .query(
      `
  INSERT INTO months (month, year, days, steps) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [month, year, days, steps]
    )
    .then((res) => {
      return res.rows[0];
    });
};
