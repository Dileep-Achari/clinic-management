const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nmc = new Schema({
    method: String,
    hfidabdm: String,
    txn_id: String,
    from_date: String,
    to_date: String,
    reqDtTime: String,
    respDtTime: String,
    respDtTimeISO: String,
    respDtTimeEPOCH: Number,
    inParams: {
        headers: {
            authorization: String, strict: false
        },
        body: {
            hfidABDM: String, strict: false,
            hfidHMIS: String, strict: false,
            fromDate: String, strict: false,
            toDate: String, strict: false,
            syncRequestType: String, strict: false,
            txn_id: String, strict: false,
            module_code: String, strict: false
        }
    },
    error: {
        "code": Number, strict: false,
        "message": String, strict: false,
        "timestamp": String, strict: false,
        "version": String, strict: false
    },
    HimsStatusCode: Number, strict: false,
    EmrStatusCode: Number, strict: false,
    HimsResponse: {
        HimsResponseDtTime: String, strict: false,
        metadata: {
            code: Number, strict: false,
            message: String, strict: false,
            timestamp: String, strict: false,
            version: String, strict: false,
        },
        resultheader: {
            from_date: String, strict: false,
            to_date: String, strict: false,
            hf_id_hmis: String, strict: false,
            hf_id_abdm: String, strict: false,
            health_facility_name: String, strict: false
        },
        result: [
            {
                "patient_name": String, strict: false,
                "year_of_birth": Number, strict: false,
                "patient_age": Number, strict: false,
                "address": String, strict: false,
                "patient_abha_id": String, strict: false,
                "patient_identification_proof": String,
                "patient_identification_number": String,
                "patient_mobile_number": String, strict: false,
                "transaction_type": Number, strict: false,
                "uhid_number": String, strict: false,
                "department_visited_name": String, strict: false,
                "department_visited_code": String, strict: false,
                "datetime_of_transaction": String, strict: false
            }
        ]
    },
    emrResponse: {
        EmrResponseDtTime: String, strict: false,
        metadata: {
            code: Number, strict: false,
            message: String, strict: false,
            timestamp: String, strict: false,
            version: String, strict: false,
        },
        result: [
            {
                "txn_id": String, strict: false,
                from_date: String, strict: false,
                to_date: String, strict: false,
                hf_id_hmis: String, strict: false,
                hf_id_abdm: String, strict: false,
                health_facility_name: String, strict: false,
                module_wise_kpi: [{
                    module_code: String, strict: false,
                    module_name: String, strict: false,
                    hmis_code: String, strict: false,
                    opd_count: Number, strict: false,
                    patient_details: [{
                        "patient_name": String, strict: false,
                        "year_of_birth": Number, strict: false,
                        "patient_age": Number, strict: false,
                        "address": String, strict: false,
                        "patient_abha_id": String, strict: false,
                        "patient_identification_proof": String,
                        "patient_identification_number": String,
                        "patient_mobile_number": String, strict: false,
                        "transaction_type": Number, strict: false,
                        "uhid_number": String, strict: false,
                        "department_visited_name": String, strict: false,
                        "department_visited_code": String, strict: false,
                        "datetime_of_transaction": String, strict: false
                    }, {
                        module_code: String, strict: false,
                        module_name: String, strict: false,
                        hmis_code: String, strict: false,
                        opd_count: Number, strict: false,
                        patient_details: [{
                            "patient_name": String, strict: false,
                            "year_of_birth": Number, strict: false,
                            "patient_age": Number, strict: false,
                            "address": String, strict: false,
                            "patient_abha_id": String, strict: false,
                            "patient_identification_proof": String,
                            "patient_identification_number": String,
                            "patient_mobile_number": String, strict: false,
                            "transaction_type": Number, strict: false,
                            "uhid_number": String, strict: false,
                            "department_visited_name": String, strict: false,
                            "department_visited_code": String, strict: false,
                            "datetime_of_transaction": String, strict: false
                        }]
                    }

                    ]
                }]
            }],
    },
    respDtTime: String, strict: false
});


//const nmcSchema = mongoose.model('nmcs', nmc);
module.exports = nmc; 