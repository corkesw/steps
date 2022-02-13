const db = require("./db/connection");
// const format = require("pg-format");

exports.selectMonths = (order = "desc", sort_by, year, month) => {
  if (order.toUpperCase() !== "ASC" && order.toUpperCase() !== "DESC") {
    console.log("error here!!!");
    return Promise.reject({
      status: 400,
      msg: "Bad request: order",
    });
  }
  if (isNaN(Number(year)) && year !== undefined) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: year",
    });
  }
  if (isNaN(Number(month)) && month !== undefined) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: month",
    });
  }
  if (month < 1 || month > 12) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: month",
    });
  }

  let queryString = "SELECT * FROM months ";
  if (year) queryString += `WHERE year = ${year} `;
  if (month) queryString += `WHERE month = ${month} `;
  if (sort_by === "steps") {
    queryString += `ORDER BY steps ${order}`;
  } else {
    queryString += `ORDER BY year ${order}, month;`;
  }
  console.log(queryString);
  return db.query(queryString).then((res) => {
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
