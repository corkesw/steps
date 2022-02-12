const { selectMonths, insertMonth } = require("./models");

exports.welcome = (_, res) => {
  res.status(200).send({ msg: "OK" });
};

exports.getMonths = (req, res) => {
  selectMonths().then((months) => {
    res.status(200).send({ months });
  });
};

exports.postMonth = (req, res, next) => {
  const { month, year, days, steps } = req.body;
  insertMonth(month, year, days, steps)
    .then((month) => {
      res.status(201).send({ month });
    })
    .catch(next);
};
