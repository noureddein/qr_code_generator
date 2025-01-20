const QRCode = require("easyqrcodejs-nodejs");
const hexToRgba = require("hex-to-rgba");

function calculateQuietZone(qrCodeSize, moduleCount) {
	const moduleSize = qrCodeSize / moduleCount; // Calculate module size
	const quietZone = moduleSize * 4; // Quiet Zone = 4 × Module Size
	return quietZone;
}

const generator = async ({ text, optionsProps = {} }) => {
	try {
		if (!text) {
			throw new Error("QR code text is falsy.");
		}
		const quietZone = calculateQuietZone(
			optionsProps.size,
			optionsProps.size / 10
		);
		const dots = optionsProps?.dots || 1;
		const SIZE = optionsProps?.size || 1000;
		const option = {
			quietZone,
			text,
			colorDark: "#000000",
			colorLight: "#ffffff",
			quietZoneColor: "#ffffff",
			width: SIZE,
			height: SIZE,
			dots: dots,
			dotScale: dots,
			dotScaleTiming: dots,
			dotScaleTiming_H: dots,
			dotScaleTiming_V: dots,
			dotScaleA: dots,
			dotScaleAO: dots,
			dotScaleAI: dots,
			...optionsProps,
		};
		const qrcode = new QRCode(option);
		const data = await qrcode.toDataURL();
		return data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

module.exports.generator = generator;
