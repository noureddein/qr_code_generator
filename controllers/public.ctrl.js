const { QrCodes } = require("../models/qrCodes.model");
const useragent = require("useragent");
const axios = require("axios");
async function getOne(req, res) {
	const { nanoId } = req.params;

	const clientIP =
		req.headers["x-forwarded-for"]?.split(",")[0] ||
		req.connection.remoteAddress;

	const userAgentString = req.headers["user-agent"]; // e.g., "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
	const agent = useragent.parse(userAgentString);

	// Get location based on IP
	const geoResponse = await axios.get(`http://ip-api.com/json/${clientIP}`);
	const locationData = geoResponse.data;

	console.log({
		location: {
			country: locationData.country,
			city: locationData.city,
			region: locationData.regionName,
			latitude: locationData.lat,
			longitude: locationData.lon,
			ip: clientIP,
		},
		device: {
			os: agent.os.toString(),
			browser: agent.toAgent(),
			device: agent.device.toString(),
		},
	});
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
