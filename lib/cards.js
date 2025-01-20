var vCardsJS = require("vcards-js");

//! To create me card
// MECARD:N:Al Abbassi,Nour Eddein;NICKNAME:noureddein1;TEL:0790057577;TEL:0790057527;TEL:0790057528;EMAIL:nour@gmail.com;BDAY:19992006;NOTE:no note;ADR:,,Street,City,State,Zipcode,Country;;

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
