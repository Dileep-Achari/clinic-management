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
	UMR: String,
	abhaAddress: {
		type: String
	},
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

const notifyData = new Schema({
	method: String,
	headers: {
		type: Object
	},
	body: {
		type: Object
	},
	consentId: String,
	clientRequestId: String,
	patient: {
		type: Object
	},
	hip: {
		type: Object
	},
	hiTypes: {
		type: Array
	},
	careContexts: {
		type: Array
	},
	dataEraseAt: String,
	timestamp: String,
	createdDt: {
		type: String,
		default: () => { return new Date().toISOString() },
	}

});

const consentRequest = new mongoose.Schema([
	{
		"_id": {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			auto: true,
		},
		requestId: String,
		timestamp: {
			type: String,
			default: () => { return new Date().toISOString() },
		},
		consentRequest: String,
		patientId: String,
		patientName: String,
		hiuId: String,
		status: String,
		grantedDt: String,
		revokeDt: String,
		deniedDt: String,
		consentArtefacts: [{
			"_id": {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				auto: true
			},
			id: String,
			status: {
				type: Boolean,
				default: true
			}
		}],
		onStatusJson: Array,
		consentPurpose: {
			text: String,
			code: String
		},
		requester: {
			name: String,
			identifier: {
				type: {
					type: String
				},
				value: String,
				system: String
			}
		},
		hiTypes: Array,
		grantedHiTypes: {
			type: Array
		},
		permission: {
			accessMode: String,
			dateRange: {
				from: String,
				to: String
			},
			dataEraseAt: String,
			frequency: {
				unit: String,
				value: String,
				repeates: String
			}
		},
		grantedPermission: { 
			accessMode: String,
			dateRange: {
				from: String,
				to: String
			},
			dataEraseAt: String,
			frequency: {
				unit: String,
				value: String,
				repeates: String
			}
		},
		audit: {
			"_id": {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				auto: true,
			},
			documentedById: String,
			documentedBy: String,
			documentedDt: {
				type: String,
				default: () => { return new Date().toISOString() },
			},
			modifiedById: String,
			modifiedBy: String,
			modifiedDt: {
				type: String
			}
		},
		history: [
			{
				"_id": {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					auto: true,
				},
				revTranId: {
					type: String
				},
				revNo: {
					type: Number
				}
			}
		]
	}
]);


const artifactsTransactions = new mongoose.Schema([
	{
		"_id": {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			auto: true,
		},
		timestamp: {
			type: String,
			default: () => { return new Date().toISOString() },
		},
		patientId: String,
		hipId: String,
		hipName: String,
		hiuId: String,
		hiuName: String,
		transactionId: String,
		consentRequestId: String,
		status: String,
		consentArtefacts: String,
		careContexts: {
			type: Array
		},
		keyMaterial: {
			privateKey: String,
			publicKey: String,
			x509PublicKey: String,
			nonce: String
		},
		audit: {
			"_id": {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				auto: true,
			},
			documentedById: String,
			documentedBy: String,
			documentedDt: {
				type: String,
				default: () => { return new Date().toISOString() },
			},
			modifiedById: String,
			modifiedBy: String,
			modifiedDt: {
				type: String
			}
		},
		history: [
			{
				"_id": {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					auto: true,
				},
				revTranId: {
					type: String
				},
				revNo: {
					type: Number
				}
			}
		]
	}
]);

const contentData = new mongoose.Schema([
	{
		"_id": {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			auto: true,
		},
		timestamp: {
			type: String,
			default: () => { return new Date().toISOString() },
		},
		consentTranId: String,
		consentRequestId: String,
		patientId: String,
		hipId: String,
		hipName: String,
		hiuId: String,
		hiuName: String,
		transactionId: String,
		status: String,
		consentArtefacts: String,
		contentData: String,
		audit: {
			"_id": {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				auto: true,
			},
			documentedById: String,
			documentedBy: String,
			documentedDt: {
				type: String,
				default: () => { return new Date().toISOString() },
			},
			modifiedById: String,
			modifiedBy: String,
			modifiedDt: {
				type: String
			}
		},
		history: [
			{
				"_id": {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					auto: true,
				},
				revTranId: {
					type: String
				},
				revNo: {
					type: Number
				}
			}
		]
	}
]);

const logging = new mongoose.Schema([
	{
		"_id": {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			auto: true,
		},
		timestamp: {
			type: String,
			default: () => { return new Date().toISOString() },
		},
		aadharNo: String,
		healthIdNumber: String,
		patientId: String,
		patientIdsData: String,
		patientName: String,
		mobile: String,
		host: String,
		hipId: String,
		hipName: String,
		hiuId: String,
		hiuName: String,
		requestId: String,
		transactionId: String,
		method: String,
		context: String,
		subContext: String,
		consentId: String,
		clientRequestId: String,
		headers: {
			type: Object
		},
		body: {
			type: Object
		},
		success: Boolean,
		description: String,
		audit: {
			"_id": {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				auto: true,
			},
			documentedById: String,
			documentedBy: String,
			documentedDt: {
				type: String,
				default: () => { return new Date().toISOString() },
			},
			modifiedById: String,
			modifiedBy: String,
			modifiedDt: {
				type: String
			}
		},
		history: [
			{
				"_id": {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					auto: true,
				},
				revTranId: {
					type: String
				},
				revNo: {
					type: Number
				}
			}
		]
	}
]);

module.exports = [
	{ "coll": 'callbacks', "schema": abha, "db": "abha" },
	{ "coll": 'apies', "schema": abhaApies, "db": "abha" },
	{ "coll": 'otps', "schema": abhaOTP, "db": "abha" },
	{ "coll": 'discover', "schema": discoverData, "db": "abha" },
	{ "coll": 'care-contexts', "schema": careContexts, "db": "abha" },
	{ "coll": 'notify', "schema": notifyData, "db": "abha" },
	{ "coll": 'consent_requests', "schema": consentRequest, "db": "abha" },
	{ "coll": 'artefacts_transactions', "schema": artifactsTransactions, "db": "abha" },
	{ "coll": 'consent_content_data', "schema": contentData, "db": "abha" },
	{ "coll": 'logging', "schema": logging, "db": "abha" },


]