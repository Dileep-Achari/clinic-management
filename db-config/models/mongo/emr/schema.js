const mongoose = require('mongoose');

const _logging = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        recStatus: {
            type: Boolean,
            default: () => { return true; }
        },
        requestDt: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        method: {
            type: String,
            default: () => { return ""; }
        },
        headers: Object,
        body: {
            type: Object,
            default: () => { return {}; }
        },
        host: {
            type: String,
            default: () => { return ""; }
        },
        appName: {
            type: String,
            default: () => { return ""; }
        },
        appToken: {
            type: String,
            default: () => { return ""; }
        },
        deviceId: {
            type: String,
            default: () => { return ""; }
        },
        fcmId: {
            type: String,
            default: () => { return ""; }
        },
        clientIP: {
            type: String,
            default: () => { return ""; }
        },
        status: {
            type: String,
            default: () => { return 200; }
        },
        responce: {
            any: mongoose.Schema.Types.Mixed
        },
        createDt: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
    }
])


module.exports = [
    { "coll": 'logging', "schema": _logging, "db": "emr" }
];
