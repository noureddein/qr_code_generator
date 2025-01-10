const fs = require("fs").promises;
const winston = require("winston");
// const { ERRORS_FILE_PATH } = require("../constants");

module.exports = async function (err, req, res, next) {
	try {
		console.log("------------>", err.message);
		// error
		// warn
		// info
		// verbose
		// debug
		// silly
		winston.error(err.message, err);
		return res.status(500).json({ message: "Something went wrong..." });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Something went wrong..." });
	}
};
