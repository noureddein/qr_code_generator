const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const debug = require("debug")("QR_CODE_APP:startup");
const config = require("config");
const cors = require("cors");
const { appEnv, API_LOG_FILE_PATH } = require("../constants");
const passport = require("passport");
const cookieParser = require("cookie-parser");

// Allow localhost and your domain
const allowedOrigins = [
	process.env.FRONTEND_ORIGIN || config.get("frontend_origin"),
	process.env.FRONTEND_PROD_ORIGIN || config.get("frontend_prod_origin"),
	process.env.FRONTEND_PROD_RENDER || config.get("front_prod_render"),
];

// [
//     process.env.FRONTEND_ORIGIN || config.get("frontend_origin"),
//     process.env.FRONTEND_PROD_ORIGIN ||
//         config.get("frontend_prod_origin"),
// ],

console.log({ env: process.env, allowedOrigins });

module.exports = function (app) {
	/* Middleware */

	app.use([
		cors({
			origin: function (origin, callback) {
				if (!origin || allowedOrigins.includes(origin)) {
					callback(null, true); // Allow the request
				} else {
					callback(new Error("Not allowed by CORS")); // Block the request
				}
			},
			methods: "GET,POST,PUT,DELETE,OPTIONS", // Specify allowed methods
			allowedHeaders: "Content-Type,Authorization",
			credentials: true,
		}),
		express.urlencoded({ extended: true }),
		express.json({ extended: true, limit: "50mb" }), // To convert any req to JSON
		helmet(),
		passport.initialize(),
		cookieParser(),
	]);

	// if (appEnv.DEVELOPMENT === config.get("node_env")) {
	debug("Morgan activated.");
	app.use(
		morgan("tiny")
		// morgan("combined", {
		// 	stream: fs.createWriteStream(API_LOG_FILE_PATH, { flags: "a" }),
		// })
	);
	// } else {
	// 	debug("Morgan deactivated.");
	// }
};
