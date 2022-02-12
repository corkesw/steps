const express = require("express");
const { welcome, getMonths, postMonth } = require("./controllers");
const { psqlErrors } = require("./errors");

const app = express();

app.use(express.json());

app.get("/api", welcome);
app.get("/api/months", getMonths);
app.post("/api/months", postMonth);

app.use(psqlErrors)

module.exports = app;
