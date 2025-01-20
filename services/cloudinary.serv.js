const cloudinary = require("cloudinary").v2;
const config = require("config");

console.log({
	cloud_name: config.get("cloud_name"),
	cloud_api_key: config.get("cloud_api_key"),
	cloud_api_secret: config.get("cloud_api_secret"),
});

cloudinary.config({
	cloud_name: config.get("cloud_name"),
	api_key: config.get("cloud_api_key"),
	api_secret: config.get("cloud_api_secret"),
});

const opts = {
	folder: "qr_code",
	resource_type: "image",
	type: "upload",
	format: "pdf",
};

const fileUploader = async (file) => {
	try {
		const response = await cloudinary.uploader.upload(file, opts);
		return response;
	} catch (error) {
		throw error;
	}
};

const deleteUploadedFile = async (publicId) => {
	try {
		const result = await cloudinary.uploader.destroy(publicId, {
			resource_type: "image",
			type: "upload",
		});
		return result;
	} catch (error) {
		console.error("Error deleting file:", error);
		throw error;
	}
};

module.exports.fileUploader = fileUploader;
module.exports.deleteUploadedFile = deleteUploadedFile;
