const mongoose = require("mongoose");
const { isDevelopmentMode } = require("../lib/envMode.lib");

/* 
    We can use joi-password-complexity package to check password complexity
*/

// location: {
// 			country: locationData.country,
// 			city: locationData.city,
// 			region: locationData.regionName,
// 			latitude: locationData.lat,
// 			longitude: locationData.lon,
// 			ip: clientIP,
// 		},
// 		device: {
// 			os: agent.os.family,
// 			browser: agent.device.family,
// 			device: agent.device.toString(),
// 		},
const statisticsSchema = new mongoose.Schema(
	{
		qrCodeId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "QrCodes",
		},
		country: { type: String, default: "", trim: true },
		city: { type: String, default: "", trim: true },
		region: { type: String, default: "", trim: true },
		latitude: { type: Number, default: 0.0 },
		longitude: { type: Number, default: 0.0 },
		ip: {
			type: String,
			default: "",
			match: [
				/^(([0-9]{1,3}\.){3}[0-9]{1,3}|([a-fA-F0-9:]+))$/,
				"Invalid IP address",
			],
		},
		os: { type: String, default: "", trim: true },
		browser: { type: String, default: "", trim: true },
		device: { type: String, default: "", trim: true },
		isDevelopmentMode: {
			type: Boolean,
			default: isDevelopmentMode,
		},
	},
	{ timestamps: true }
);
const Statistics = mongoose.model("Statistics", statisticsSchema);

exports.Statistics = Statistics;
