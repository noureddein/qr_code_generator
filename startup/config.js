const config = require("config");

module.exports = function () {
	// This will terminate the process with the unhandled exceptions
	// if (!config.get("jwt_private_key")) {
	// 	throw new Error("FATAL ERROR: jwt_private_key is not defined.");
	// }
};
