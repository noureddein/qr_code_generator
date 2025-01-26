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

	// TODO: Do not add statistics if the qr code is inactive.
	const qrCodeRecord = await QrCodes.findOne({ nanoId }).select(
		"-qrDesign -__v -userId -createdAt -updatedAt"
	);

	if (!qrCodeRecord) {
		return res.status(404).json({ message: "QR Code not found" });
	}

	if (!qrCodeRecord.isActive) {
		return res.status(403).json({ message: "Currently is in active." });
	}

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

	const statistics = new Statistics({
		qrCodeId: qrCodeRecord._id,
		...statisticsData.device,
		...statisticsData.location,
	});

	await statistics.save();

	return res.status(200).json({ row: qrCodeRecord });
}

module.exports = {
	getOne,
};
