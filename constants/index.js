const path = require("path");
const ms = require("ms");

const appEnv = {
	DEVELOPMENT: "development",
	PRODUCTION: "production",
};

const API_LOG_FILE_PATH = path.join(__dirname, "../logs", "api_logs.log");
const ERROR_LOGS_FILE_PATH = path.join(__dirname, "../logs", "errors_logs.log");
const UNCAUGHT_EXCEPTIONS_FILE_PATH = path.join(
	__dirname,
	"../logs",
	"uncaught_exception.log"
);

const REFRESH_TOKEN_EXPIRY_IN_MILLISECOND = ms("1d");
const REFRESH_TOKEN_EXPIRY_IN_SECONDS =
	REFRESH_TOKEN_EXPIRY_IN_MILLISECOND / 1000;

const ACCESS_TOKEN_EXPIRY_IN_MILLISECOND = ms("15m");
const ACCESS_TOKEN_EXPIRY_IN_SECONDs = ms("15m") / 1000;

const QR_CODE_TYPE = {
	URL: "url",
	VCARD: "vcard",
	EMAIL: "email",
	TEXT: "text",
	PDF: "pdf",
};

const url = {
	name: "",
	url: "",
	text: "",
};

const text = {
	name: "",
	text: "",
};

const email = {
	email: "",
	subject: "",
	message: "",
	text: "",
	name: "",
};

const vCard = {
	name: "",
	text: "",
	firstName: "",
	lastName: "",
	organization: "",
	position: "",
	phoneWork: "",
	phoneMobile: "",
	fax: "",
	email: "",
	website: "",
	street: "",
	zipcode: "",
	city: "",
	state: "",
	country: "",
	imageBase64: "",
	imageType: "",
};

const pdf = {
	name: "",
	text: "",
};

const DEFAULT_QR_DATA = {
	url,
	text,
	email,
	vCard,
	pdf,
};

const SORT_KEYS = {
	LAST_CREATED: "last_created",
	NAME_ASC: "name_asc",
	NAME_DESC: "name_desc",
};

const STATUS_TYPE = {
	ACTIVE: 1,
	IN_ACTIVE: 2,
};

const STORAGE_FOLDERS_NAME = {
	ICONS: "qr_code_icons",
	ASSETS: "qr_code_prod_assets",
};

module.exports = {
	appEnv,
	API_LOG_FILE_PATH,
	ERROR_LOGS_FILE_PATH,
	UNCAUGHT_EXCEPTIONS_FILE_PATH,
	REFRESH_TOKEN_EXPIRY_IN_MILLISECOND,
	REFRESH_TOKEN_EXPIRY_IN_SECONDS,
	ACCESS_TOKEN_EXPIRY_IN_MILLISECOND,
	ACCESS_TOKEN_EXPIRY_IN_SECONDs,
	QR_CODE_TYPE,
	DEFAULT_QR_DATA,
	SORT_KEYS,
	STATUS_TYPE,
	STORAGE_FOLDERS_NAME,
};
