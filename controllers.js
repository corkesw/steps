const { selectMonths, insertMonth } = require("./models");

exports.welcome = (_, res) => {
  res.status(200).send({ msg: "OK" });
};

exports.getMonths = (req, res, next) => {
  const { order, sort_by, year, month } = req.query;
  selectMonths(order, sort_by, year, month)
    .then((months) => {
      res.status(200).send({ months });
    })
    .catch(next);
};

exports.postMonth = (req, res, next) => {
  const { month, year, days, steps } = req.body;
  insertMonth(month, year, days, steps)
    .then((month) => {
      res.status(201).send({ month });
    })
    .catch(next);
};
