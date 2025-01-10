const mongoose = require("mongoose");
const debug = require("debug")("QR_CODE_APP:database");
const config = require("config");

const DB_URI = config.get("db_uri");

const isValidId = (id) => {
	const isValid = mongoose.Types.ObjectId.isValid(id);
	return isValid;
};

module.exports = async function () {
	// No need to create the database, the first query will create the database for us
	// No need to the catch block, because winston handle it

	const db = await mongoose.connect(DB_URI, {
		// useNewUrlParser: true,
		// useUnifiedTopology: true,
	});

	// Access the underlying MongoDB driver
	const admin = db.connection.db.admin();

	// Execute the buildInfo command to get MongoDB server version
	const info = await admin.command({ buildInfo: 1 });

	debug(`Connected to Mongodb...`);
	debug(`Mongodb version: ${info.version}`);
};

module.exports.isValidId = isValidId;
