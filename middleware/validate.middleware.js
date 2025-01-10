const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
	const result = validationResult(req);

	if (!result.isEmpty()) {
		return res.status(409).send({
			message: "Missing required values.",
			errors: result.errors,
		});
	}
	next();
};

module.exports.validateRequest = validateRequest;
