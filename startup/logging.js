require("express-async-errors");
const debug = require("debug")("QR_CODE_APP:startup");
const config = require("config");
const winston = require("winston");

const {
	ERROR_LOGS_FILE_PATH,
	UNCAUGHT_EXCEPTIONS_FILE_PATH,
} = require("../constants");

module.exports = function () {
	// Handle uncaught exceptions
	winston.exceptions.handle(
		new winston.transports.File({ filename: UNCAUGHT_EXCEPTIONS_FILE_PATH })
	);

	process.on("uncaughtException", (ex) => {
		console.log({ ex });

		winston.error(ex.message, ex);
		process.exit(1);
	});

	// Handle unhandled promise rejections by converting them to exceptions
	process.on("unhandledRejection", (ex) => {
		console.log({ ex });

		throw ex; // to let winston handle it
	});

	winston.add(
		new winston.transports.File({ filename: ERROR_LOGS_FILE_PATH })
	);

	debug(`Application Evn.: ${config.get("node_env")}`);
};
