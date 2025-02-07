const mongoose = require("mongoose");
const _mastr = new mongoose.Schema([
	{
		type: String,
		name: String,
		data: [{
			Type: String,
			cd: String,
			Name: String,
			gender: String,
			dob: String,
			doj: String,
			mobile: String,
			address: String,
			skill: String,
			status: String,
			lastLoggedIn: String,
			lastLoggedOut: String,
			geoCoord: {
				latitude: String,
				longitude: String
			},
			createDt: {
				type: String,
				required: true,
				default: () => { return new Date().toISOString() }
			},
			createBy: String,
			modifyDt: String,
			modifyBy: String
		}],
		createBy: String,
		createDt: {
			type: String,
			required: true,
			default: () => { return new Date().toISOString() }
		},
		modifyBy: String,
		modifyDt: String
	}

]);

const transcation = new mongoose.Schema([
	{
		"_id": {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			auto: true,
		},
		"reqCd": {
			type: String,
			required: true,
			default: () => { return `REQ001` }
		},
		"serviceCd": String,
		"fromLocCd": String,
		"fromLocName": String,
		"toLocation": [
			{
				"_id": {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					auto: true,
				},
				"seriesNo": Number,
				"locCd": String,
				"locName": String
			}
		],
		"priority": String,
		"patientDtls": {
			"_id": {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				auto: true,
			},
			"name": String,
			"gender": String,
			"cd": String,
			"bed": String,
			"health": String
		},
		"skilReq": String,
		"remarks": String,
		"reqDt": {
			type: String,
			default: new Date().toISOString(),
		},
		"reqBy": String,
		"status": String,
		"totalWaitTime": Number,
		"assignedPorterCd": String,
		"assignedPorterName": String,
		"assignedDtTime": String,
		"actions": [
			{
				"_id": {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					auto: true,
				},
				"status": {
					type: String
				},
				"porterCd": String,
				"dtTime": {
					type: String,
					default: new Date().toISOString(),
				},
				"waitTime": String,
				"childObj": {
					"_id": {
						type: mongoose.Schema.Types.ObjectId,
						auto: true,
					},
					name: String,
					age: Number,
					"dtTime": {
						type: String,
						default: () => { return new Date().toISOString() }
					}
				},
				"data": [
					{
						"_id": {
							type: mongoose.Schema.Types.ObjectId,
							required: true,
							auto: true,
						},
						"name": String,
						"dtTime": {
							type: String,
							default: new Date().toISOString(),
						},
						"obj": {
							name: String,
							addr: String
						},
						child: [
							{
								"_id": {
									type: mongoose.Schema.Types.ObjectId,
									auto: true,
								},
								cd: String,
								value: String,
								sub: {
									"_id": {
										type: mongoose.Schema.Types.ObjectId,
										auto: true,
									},
									val: String
								},
								dtTime: {
									type: String,
									default: () => { return new Date().toISOString() }
								}
							}
						]
					}
				]
			}
		],
		"createDt": {
			type: String,
			required: true,
			default: () => { return new Date().toISOString() }
		},
		"createBy": String,
		"modifyBy": String,
		"modifyDt": String
	}
])

//mongoose.model('masters', _mastr)
module.exports = [
	{ "coll": 'masters', "schema": _mastr, "db": "porter" },
	{ "coll": 'transactions', "schema": transcation, "db": "porter" }
];