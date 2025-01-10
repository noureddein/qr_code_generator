const QRCode = require("easyqrcodejs-nodejs");
const hexToRgba = require("hex-to-rgba");

const generator = async (optionsProps) => {
	try {
		const { size, quietZoneColor, ...rest } = optionsProps;
		const options = {
			...rest,
			quietZoneColor: hexToRgba(quietZoneColor),
			width: size,
			height: size,
		};
		const qrcode = new QRCode(options);
		const data = await qrcode.toDataURL();
		return data;
	} catch (error) {
		throw error;
	}
};

const generateWithDefault = async (publicLink) => {
	try {
		// const { size, quietZoneColor, ...rest } = optionsProps;
		// const options = {
		// 	...rest,
		// 	quietZoneColor: hexToRgba(quietZoneColor),
		// 	width: size,
		// 	height: size,
		// };
		const qrcode = new QRCode({ text: publicLink });
		const data = await qrcode.toDataURL();
		return data;
	} catch (error) {
		throw error;
	}
};

module.exports.generator = generator;
module.exports.generateWithDefault = generateWithDefault;
