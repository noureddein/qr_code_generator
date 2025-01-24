const { QR_CODE_TYPE, appEnv } = require("../constants");
const { QrCodes } = require("../models/qrCodes.model");

async function getOne(req, res) {
	const { nanoId } = req.params;

	const ip =
		req.headers["x-forwarded-for"] || // Use this if behind a proxy like AWS, Netlify, etc.
		req.connection.remoteAddress; // Fallback to direct IP
	console.log({ ip });
	const result = await QrCodes.findOne({ nanoId }).select(
		"-qrDesign -__v -userId -_id -createdAt -updatedAt"
	);

	if (!result) {
		return res.status(404).json({ message: "QR Code not found" });
	}

	if (!result.isActive) {
		return res.status(403).json({ message: "Currently is in active." });
	}

	return res.status(200).json({ row: result });
}

module.exports = {
	getOne,
};
