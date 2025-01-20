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

const validatePDFFile = (req, res, next) => {
	req.body.file = req.file;

	next();
};

module.exports.validateRequest = validateRequest;
module.exports.validatePDFFile = validatePDFFile;
