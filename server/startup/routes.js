const express = require("express");
const error = require("../middleware/error");
const recipes = require("../routes/recipes");
const customers = require("../routes/customers");
const meals = require("../routes/meals");
const purchases = require("../routes/purchases");
const users = require("../routes/users");
const auth = require("../routes/auth");
const home = require("../routes/home");
const dashboard = require("./routes/dashboard");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use("/api/recipes", recipes);
  app.use("/api/customers", customers);
  app.use("/api/meals", meals);
  app.use("/api/purchases", purchases);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/", home);
  app.use(error);
  app.use("/api/dashboard", dashboard);
};
