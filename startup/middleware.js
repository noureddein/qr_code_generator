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
// const { auth } = require("express-openid-connect");
const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");

// Allow localhost and your domain
const allowedOrigins = [
	process.env.FRONTEND_ORIGIN || config.get("frontend_origin"),
	process.env.FRONTEND_PROD_ORIGIN || config.get("frontend_prod_origin"),
	process.env.FRONTEND_PROD_RENDER || config.get("front_prod_render"),
	process.env.FRONTEND_NETLIFY || config.get("front_end_netlify"),

	...(process.env.NODE_ENV === appEnv.DEVELOPMENT
		? ["http://localhost:3000"]
		: []),
];
console.log({ NODE_ENV: process.env.NODE_ENV, allowedOrigins });

if (process.env.NODE_ENV === appEnv.PRODUCTION) {
	console.log({ env: process.env, allowedOrigins });
}

const authConfig = {
	authRequired: false,
	auth0Logout: true,
	baseURL: config.get("auth0_base_url"),
	clientID: config.get("auth0_client_id"),
	issuerBaseURL: config.get("auth0_issuer_base_url"),
	secret: config.get("auth0_secret"),
	authorizationParams: {
		response_type: "code", // Ensure this includes 'id_token'
		scope: "openid profile email", // Include 'openid'
		audience: "http://localhost:5173",
	},
};

const checkJwt = auth({
	audience: "http://localhost:5173",
	issuerBaseURL: config.get("auth0_issuer_base_url"),
});
// console.log({ authConfig });

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
		express.json({ extended: true, limit: "5mb" }), // To convert any req to JSON
		helmet(),
		passport.initialize(),
		cookieParser(),
		// auth(authConfig),
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

module.exports.checkJwt = checkJwt;
