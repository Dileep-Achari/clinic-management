const _nmc = require("../../db-config/models/mongo/nmc/schema");
const _porter = require("../../db-config/models/mongo/porter/schema");
const _patient = require("../../db-config/models/mongo/patientcare/schema");
const _abha = require("../../db-config/models/mongo/abha/schema")
const _monography = require("../../db-config/models/mongo/monography/schema");
const _monography_staging = require("../../db-config/models/mongo/staging/monography_staging/schema");
const _monography_production = require("../../db-config/models/mongo/production/monography_production/schema");
const _drugDetail_staging = require("../../db-config/models/mongo/staging/drugDetail/schema");
const _drugDetail_production = require("../../db-config/models/mongo/production/drugDetails_production/schema");
const _cm = require("../../db-config/models/mongo/formBuilder/schema");
const _cmv1 = require("../../db-config/models/mongo/cm/schema");
const _emr = require("../../db-config/models/mongo/emr/schema");
const _dkcrush = require("../../db-config/models/mongo/dkcrush/schema");
const _ophthamology_ecg = require("../../db-config/models/mongo/ophthamologyAndEcg/schema");

module.exports = [
    // { "db": "nmc", "schema": _nmc, "multi": false, alias: [] },
    // { "db": "porter", "schema": _porter, "multi": false, alias: [] },
    // { "db": "patient_care", "schema": _patient, "multi": true, alias: ["emr", "speed"] }, 
    // { "db": "ABHA", "schema": _abha, "multi": false, alias: [] },
    // { "db": "monography", "schema": _monography, "multi": false, alias: [] },
    // { "db": "monography_staging", "schema": _monography_staging, "multi": false, alias: [] },
    // { "db": "monography_production", "schema": _monography_production, "multi": false, alias: [] },
    // { "db": "drugDetails_staging", "schema": _drugDetail_staging, "multi": false, alias: [] },
    // { "db": "drugDetails_production", "schema": _drugDetail_production, "multi": false, alias: [] },
    // { "db": "formBuilder", "schema": _cm, "multi": false, alias: [] },
    { "db": "cm", "schema": _cmv1, "multi": true, alias: ["emr", "rh", "kd", "sh", "hm", "km"] },
    // { "db": "emr", "schema": _emr, "multi": false, alias: [] },
    // { "db": "dk_crush", "schema": _dkcrush, "multi": true, alias: ["emr"] },
    // { "db": "ophthamology_ecg", "schema": _ophthamology_ecg, "multi": true, alias: ["emr", "shoptha"] },
];