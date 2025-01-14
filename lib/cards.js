var vCardsJS = require("vcards-js");

//! To create me card
// MECARD:N:Al Abbassi,Nour Eddein;NICKNAME:noureddein1;TEL:0790057577;TEL:0790057527;TEL:0790057528;EMAIL:nour@gmail.com;BDAY:19992006;NOTE:no note;ADR:,,Street,City,State,Zipcode,Country;;

function createMeCard({
	firstName = "",
	lastName = "",
	nickname = "",
	phone1 = "",
	phone2 = "",
	phone3 = "",
	email = "",
	website = "",
	birthday = "",
	street = "",
	zipcode = "",
	city = "",
	state = "",
	country = "",
	notes = "",
}) {
	// Create the me card string
	let meCard = `MECARD:\n`;
	meCard += `N:${lastName},${firstName};\n`; // Full Name
	meCard += `NICKNAME:${nickname};\n`; // Email
	meCard += `TEL:${phone1};\n`;
	meCard += `TEL:${phone2};\n`;
	meCard += `TEL:${phone3};\n`;
	meCard += `EMAIL:${email};\n`;
	meCard += `BDAY:${birthday};\n`;
	meCard += `NOTE:${notes};\n`;
	meCard += `URL:${website};\n`;
	meCard += `ADR:${street},${city},${state},${zipcode},${country};;`;

	return meCard;
}

const createVCard = (vCardData) => {
	const vCard = vCardsJS();

	vCard.firstName = vCardData.firstName;
	vCard.lastName = vCardData.lastName;
	vCard.organization = vCardData.organization;
	vCard.title = vCardData.position;
	vCard.workPhone = vCardData.phoneWork;
	vCard.cellPhone = vCardData.phoneMobile;
	vCard.workFax = vCardData.fax;
	vCard.email = vCardData?.email || "";
	vCard.url = vCardData?.website || "";
	vCard.workAddress.label = "Address";
	vCard.workAddress.street = vCardData.street;
	vCard.workAddress.postalCode = vCardData.zipcode;
	vCard.workAddress.city = vCardData.city;
	vCard.workAddress.stateProvince = vCardData.state;
	vCard.workAddress.countryRegion = vCardData.country;

	return vCard;
};

module.exports = {
	createVCard,
};
