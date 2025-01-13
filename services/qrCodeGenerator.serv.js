const QRCode = require("easyqrcodejs-nodejs");
const hexToRgba = require("hex-to-rgba");

const generator = async (optionsProps) => {
	try {
		const { size, quietZoneColor, dots = 1, ...rest } = optionsProps;
		const options = {
			...rest,
			quietZoneColor: hexToRgba(quietZoneColor),
			width: size,
			height: size,

			// ====== dotScale
			dotScale: dots, // For body block, must be greater than 0, less than or equal to 1. default is 1

			dotScaleTiming: dots, // Dafault for timing block , must be greater than 0, less than or equal to 1. default is 1
			dotScaleTiming_H: dots, // For horizontal timing block, must be greater than 0, less than or equal to 1. default is 1
			dotScaleTiming_V: dots, // For vertical timing block, must be greater than 0, less than or equal to 1. default is 1

			dotScaleA: dots, // Dafault for alignment block, must be greater than 0, less than or equal to 1. default is 1
			dotScaleAO: dots, // For alignment outer block, must be greater than 0, less than or equal to 1. default is 1
			dotScaleAI: dots, // For alignment inner block, must be greater than 0, less than or equal to 1. default is 1
		};
		console.log({ options });

		const qrcode = new QRCode(options);
		const data = await qrcode.toDataURL();
		return data;
	} catch (error) {
		console.log(error);
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
