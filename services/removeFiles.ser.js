const fs = require("node:fs");
const path = require("node:path");

const directory = process.cwd() + "/uploads";

// Remove the uploaded files from the temp folder
const removeUploadedFiles = (filesNames = []) => {
	if (!Array.isArray(filesNames)) {
		throw new Error("File names must be an array.");
	}

	fs.readdir(directory, (err, files) => {
		if (err) throw err;

		for (const file of files) {
			fs.unlink(path.join(directory, file), (err) => {
				if (err) throw err;
			});
		}
	});
};

module.exports.removeUploadedFiles = removeUploadedFiles;
