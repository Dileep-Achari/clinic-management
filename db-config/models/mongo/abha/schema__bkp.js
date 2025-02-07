const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const abha = new Schema({
	method: String,
	headers: {
		type: Object
	},
	body: {
		type: Object
	},
	healthId: String,
	healthIdNumber: String,
	clientRequestId: String,
	transactionId: String,
	mode: String,
	success: Boolean,
	errDesc: Object,
	createdDt: {
		type: String,
		default: () => { return new Date().toISOString() },
	}

});

const abhaApies = new Schema({
	method: String,
	healthId: String,
	healthIdNumber: String,
	response: Object,
	createdDt: {
		type: String,
		default: () => { return new Date().toISOString() },
	}

});

const abhaOTP = new Schema({
	method: String,
	headers: {
		type: Object
	},
	body: {
		type: Object
	},
	patientId: String,
	referenceNumber: {
		type: String,
		required: true
	},
	otp: {
		type: Number,
		required: true
	},
	createdDt: {
		type: String,
		default: () => { return new Date().toISOString() },
	}

});

const discoverData = new Schema({
	method: String,
	headers: {
		type: Object
	},
	body: {
		type: Object
	},
	patientId: String,
	createdDt: {
		type: String,
		default: () => { return new Date().toISOString() },
	}
});

const careContexts = new Schema({
	method: String,
	patientId: String,
	data: Array,
	createdDt: {
		type: String,
		default: () => { return new Date().toISOString() },
	}
});

module.exports = [
	{ "coll": 'callbacks', "schema": abha, "db": "abha" },
	{ "coll": 'apies', "schema": abhaApies, "db": "abha" },
	{ "coll": 'otps', "schema": abhaOTP, "db": "abha" },
	{ "coll": 'discover', "schema": discoverData, "db": "abha" },
	{ "coll": 'care-contexts', "schema": careContexts, "db": "abha" }
]