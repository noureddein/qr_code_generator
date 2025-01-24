const { appEnv } = require("../constants");
const config = require("config");

const isDevelopmentMode = () => {
	return config.get("node_env") === appEnv.DEVELOPMENT;
};

module.exports.isDevelopmentMode = isDevelopmentMode;
