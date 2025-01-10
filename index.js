require("dotenv").config();
const debug = require("debug")("QR_CODE_APP:startup");
const express = require("express");
const config = require("config");
const passport = require("passport");

const PORT = process.env.PORT || config.get("port");
const app = express();

require("./startup/passport");
require("./startup/middleware")(app);
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

app.listen(PORT, () => debug(`Server run on port: ${PORT}`));
