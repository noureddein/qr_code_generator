const { checkSchema } = require("express-validator");

const getOne = checkSchema({
	nanoId: {
		in: ["params"],
		exists: true,
	},
});

module.exports = { getOne };
