const db = require("../connection");
const { formatData } = require("../utils/utils");
const format = require("pg-format");

const seed = (data) => {
  return db
    .query("DROP TABLE IF EXISTS months;")
    .then(() => {
      return db.query(
        "CREATE TABLE months (month_id SERIAL, month INTEGER NOT NULL, year INTEGER NOT NULL, days INTEGER NOT NULL, steps INTEGER NOT NULL);"
      );
    })
    .then(() => {
      const months = formatData(data, ["month", "year", "days", "steps"]);
      const queryString = format(
        "INSERT INTO months (month, year, days, steps) VALUES %L RETURNING *;",
        months
      );
      return db.query(queryString);
    })
    .catch((err) => console.log(err, "error"));
};

module.exports = { seed };
