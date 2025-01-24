const { QrCodes } = require("../models/qrCodes.model");
const useragent = require("useragent");

async function getOne(req, res) {
	const { nanoId } = req.params;

	const ip =
		req.headers["x-forwarded-for"] || // Use this if behind a proxy like AWS, Netlify, etc.
		req.connection.remoteAddress; // Fallback to direct IP

	const userAgentString = req.headers["user-agent"]; // e.g., "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
	console.log({ userAgentString });
	const agent = useragent.parse(userAgentString);

	console.log({ ip, agent });
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
