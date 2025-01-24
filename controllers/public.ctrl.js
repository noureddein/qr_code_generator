const { QrCodes } = require("../models/qrCodes.model");
const useragent = require("useragent");
const axios = require("axios");
const { Statistics } = require("../models/statistics.model");
async function getOne(req, res) {
	const { nanoId } = req.params;

	const clientIP =
		req.headers["x-forwarded-for"]?.split(",")[0] ||
		req.connection.remoteAddress;

	console.log({
		forwarded: req.headers["x-forwarded-for"],
		remoteAddress: req.connection.remoteAddress,
	});
	const userAgentString = req.headers["user-agent"]; // e.g., "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
	const agent = useragent.parse(userAgentString);

	// Get location based on IP
	const geoResponse = await axios.get(`http://ip-api.com/json/${clientIP}`);
	const locationData = geoResponse.data;

	const statisticsData = {
		location: {
			country: locationData.country,
			city: locationData.city,
			region: locationData.regionName,
			latitude: locationData.lat,
			longitude: locationData.lon,
			ip: clientIP,
		},
		device: {
			os: agent.os.family,
			browser: agent.device.family,
			device: agent.device.toString(),
		},
	};

	console.log(statisticsData);
	const result = await QrCodes.findOne({ nanoId }).select(
		"-qrDesign -__v -userId -_id -createdAt -updatedAt"
	);

	const statistics = new Statistics({
		...statisticsData.device,
		...statisticsData.location,
	});

	await statistics.save();

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
