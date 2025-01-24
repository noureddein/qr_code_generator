const mongoose = require("mongoose");
const { QR_CODE_TYPE, appEnv } = require("../constants");
const isBase64 = require("is-base64");
const { isDevelopmentMode } = require("../lib/envMode.lib");

const qrDesignSchema = new mongoose.Schema({
	colorDark: {
		type: String,
		default: "#000000",
	},
	colorLight: {
		type: String,
		default: "#ffffff",
	},
	quietZoneColor: {
		type: String,
		default: "#ffffff",
	},
	size: {
		type: Number,
		default: 1000,
	},
	quietZone: {
		type: Number,
		default: 100,
		min: 0,
		max: 1000,
	},
	dots: {
		type: Number,
		default: 1.0,
		min: 0.1,
		max: 1.0,
		validate: {
			validator: function (value) {
				// Check for floating-point value within 0.1 to 1.0.
				return Number.isFinite(value) && value >= 0.1 && value <= 1.0;
			},
			message: (props) =>
				`Dots must be a floating-point number between 0.1 and 1.0. Got: ${props.value}`,
		},
	},
	logoBase64: {
		type: String,
		default: "",
		validate: {
			validator: function (value) {
				if (value)
					return isBase64(value, {
						allowMime: true,
						mimeRequired: true,
					});
			},
			message: (props) => `Invalid base64 logo.`,
		},
	},
});

const qrDataSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	// Add additional fields for qrData if necessary
});

const qrCodesSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	qrData: {
		type: Object,
		required: true,
	},
	qrDesign: {
		type: qrDesignSchema,
		required: true,
	},
	type: {
		type: String,
		required: true,
		enum: [...Object.values(QR_CODE_TYPE)],
	},
	image: {
		type: String,
		required: true,
	},
	nanoId: {
		type: String,
		required: true,
	},
	publicLink: {
		type: String,
		required: true,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	isDevelopmentMode: {
		type: Boolean,
		default: isDevelopmentMode(),
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

const QrCodes = mongoose.model("QrCodes", qrCodesSchema);

exports.QrCodes = QrCodes;
