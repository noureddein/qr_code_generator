const generator = require("../lib/qrCodeGenerator.lib");

async function generateQRCode(req, res) {
	const data = await generator(req.body);

	return res.status(200).json({ image: data });
}

module.exports = {
	generateQRCode,
};
