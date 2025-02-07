const _nmc = require("../../db-config/models/mongo/nmc/schema");
const _porter = require("../../db-config/models/mongo/porter/schema");
const _patient = require("../../db-config/models/mongo/patientcare/schema");
const _abha = require("../../db-config/models/mongo/abha/schema")
const _monography = require("../../db-config/models/mongo/monography/schema");
//const _cm = require("../../db-config/models/mongo/clinicManagement/schema");
const _cmv1 = require("../../db-config/models/mongo/cm/schema");


module.exports = [
    { "db": "nmc", "schema": _nmc, "multi": false, alias: [] },
    { "db": "porter", "schema": _porter, "multi": false, alias: [] },
    { "db": "patientcare", "schema": _patient, "multi": false, alias: [] },
    { "db": "ABHA", "schema": _abha, "multi": false, alias: [] },
    { "db": "monography", "schema": _monography, "multi": false, alias: [] },
   // { "db": "clinicManagement", "schema": _cm, "multi": false, alias: [] },
    { "db": "cm", "schema": _cmv1, "multi": true, alias: ["emr", "rh", "ah", "kd"] }
];