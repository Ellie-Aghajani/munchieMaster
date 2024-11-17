require("dotenv").config();
const winston = require("winston");
const express = require("express");
const cors = require("cors");
const app = express();

var whitelist = [
  "http://localhost:3000",
  "http://24.199.125.19",
  "http://munchiemaster.online",
  "https://munchiemaster.online",
];

const corsOptions = {
  origin: whitelist,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

//Serve static files from 'public/uploads'
app.use("/uploads", express.static("public/uploads"));

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")(); //we call the function
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || 52912;
const server = app.listen(port, () =>
  winston.info(`App is listening on port ${port}`)
);

module.exports = server;
