const moment = require('moment');
const _ = require('lodash');
const _mUtils = require("../../../../constants/mongo-db/utils");


//appointments
async function emr2HisEvent111Trnsfrm(inputData, req, duration) {
    try {
        if (!Array.isArray(inputData) || inputData.length === 0) {
            return { success: false, data: [], desc: "No data available for processing" }
        }
        if (inputData && inputData[0].age.length > 0) {
            let age = inputData[0].age
            function transformDOB(age) {
                if (!age) {
                    return null;
                }
                const numericAge = parseInt(age.match(/\d+/)[0], 10);
                const yearOfBirth = moment().year() - numericAge;
                const dob = moment(`${yearOfBirth}-01-01`).format('YYYY-MM-DDTHH:mm:ss');
                return dob;
            }
        }
        let inputDate = inputData[0].dateTime.slice(0, 10);
        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "dateTime": { $regex: inputDate, $options: 'i' }
            },
            "selectors": "-history -audit"
        }
        let _mAppResp = await _mUtils.commonMonogoCall("cm_appointments", "find", _filter, "", "", "", req.tokenData.dbType)
        if (!(_mAppResp && _mAppResp.success)) {
            return ({ success: false, status: 400, desc: _mResp.desc || "", data: [] });
        }
        const sequenceConfig = [
            { key: '_eventTrackSeqResp', seqName: 'EventTrackId' },
            //{ key: '_appointmentIdSeqResp', seqName: 'AppointmentId' },
            { key: '_olrIdSeqResp', seqName: 'DoctorId' },
            { key: '_docSchTimeIdSeqResp', seqName: 'DocSchTimeId' },
            { key: '_uhrSeqResp', seqName: 'UHR' },
            { key: '_patientSeqResp', seqName: 'PatientId' }
        ]
        const sequences = {};
        for (const { key, seqName } of sequenceConfig) {
            const response = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName }, "cm", req);
            if (!(response && response.success)) {
                return ({ success: false, status: 400, desc: response.desc || "", data: response.data || [] });
            }
            sequences[key] = response.data;
        }
        const transfrormedData = inputData.map(item => {
            const trans = {
                orgId: req.tokenData.syncOrgId,
                locId: req.tokenData.syncOrgId,
                migId: Number(req.tokenData.emrMigId),
                eventId: 111,
                eventName: "Appointments",
                eventTrackId: Number(sequences._eventTrackSeqResp),
                eventDataJson: [{
                    "EVTS_SLOT_DET_ID": item.appointmentId,
                    "EVENT_ID": 111,
                    "EVENT_TRACK_ID": Number(sequences._eventTrackSeqResp),
                    "OLR_ID": Number(sequences._olrIdSeqResp),
                    "MIG_ID": Number(req.tokenData.emrMigId), 
                    "ORG_ID": req.tokenData.syncOrgId,
                    "LOC_ID": req.tokenData.syncLocId,
                    "DOCTOR_ID": sequences._olrIdSeqResp,//Number((item.docDetails.i_docCd).match(/\d+/)),
                    "RSRC_SCH_TIME_ID": Number(sequences._docSchTimeIdSeqResp),
                    "SLOTS_ID": item.appointmentId,
                    "PATIENT_ID": Number(sequences._patientSeqResp),//Number(item.UMR.replace(/\D/g, '')),
                    "UHR_NO": sequences._uhrSeqResp,
                    "SLOT_TYPE": null,
                    "I_ORG_ID": req.tokenData.i_orgCd,
                    "I_LOC_ID": req.tokenData.i_locCd,
                    "I_DOCTOR_ID": item.docDetails.i_docCd,
                    "I_SLOT_TYPE": null,
                    "I_PATIENT_ID":  Number(item.UMR.replace(/\D/g, '')),//sequences._patientSeqResp,
                    "I_UMR_NO": item.UMR || "",
                    "APMNT_DT": item.dateTime,
                    "SCH_START_TIME": (new Date(item.dateTime)).toISOString().slice(0, 19),
                    "SCH_END_TIME": new Date((new Date(item.dateTime)).getTime() + duration * 60000).toISOString().slice(0, 19),
                    "REMARKS": item.reasonForVisit || "",
                    "REASON_FOR_VISIT": item.reasonForVisit || "",
                    "FIRST_NAME": item.patName.split(" ")[0] || item.patName || "",
                    "MIDDLE_NAME": null,
                    "LAST_NAME": item.patName.split(" ").slice(1).join(" ") || "",
                    "DISPLAY_NAME": item.patName,
                    "EMAIL_ID": null,// item.email || "",
                    "MOBILE_NO1": item.mobile,
                    "AMT": null,
                    "CONSULTATION_FEE": null,
                    "STATUS_CD": "",
                    "REGISTARTION_FEE": "",
                    "I_CONSULTATIONNO": null,
                    "IS_VIP": item.isVIP ? "Y" : "N",
                    "CHK_STATUS": null,
                    "VISIT_TYPE": "GN",
                    "API_URL": req.tokenData.syncApiUrl,
                    "CREATE_BY": item.audit.documentedBy,
                    "DISPLAY_TIME": item.dateTime.split("T")[1].split(":").slice(0, 2).join(":"),
                    "APT_REF_NUM": null,
                    "REF_BY": null,
                    "SLOT_TOKEN": (_mAppResp.data.length).toString(),
                    "AGE": item.age.replace("Y", "") || "",
                    "GENDER": item.gender.charAt(0).toUpperCase() || "",
                    "DOB": item.age ? transformDOB(item.age) : "",
                    "PATIENT_TYPE": null,// item.apmntType,
                    "CREATE_DT": item.audit.documentedDt,
                    "SLOT_STATUS_ID": (item.status == "BOOKED") ? 2 : (item.status == "CANCELLED") ? 3 : 1,
                    "TITLE_CD": item.titleCd,
                    "VNDR_REF_ID": null,
                    "VNDR_REF_NAME": null
                }]
            }
            return trans;
        });

        let _mResp = await _mUtils.commonMonogoCall("cm_emr_to_his_syncs", "insertMany", transfrormedData, "", "", "", req.tokenData.dbType)
        if (!(_mResp && _mResp.success)) {
            return ({ success: false, status: 400, desc: _mResp.desc || "", data: [] });
        }
        else {
            return ({ success: true, status: 200, desc: "", data: _mResp.data || [] });
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
}

//investigations
async function emr2HisEvent93Trnsfrmd(inputData, req) {
    try {
        const sequenceConfig = [
            { key: '_eventTrackSeqResp', seqName: 'EventTrackId' },
            { key: '_invOrderId', seqName: 'InvOrderId' },
            { key: '_uhrSeqResp', seqName: 'UHR' },
        ];

        const sequences = {};
        for (const { key, seqName } of sequenceConfig) {
            const response = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName }, "cm", req);
            if (!(response && response.success)) {
                return ({ success: false, status: 400, desc: response.desc || "", data: response.data || [] });
            }
            sequences[key] = response.data;
        }

        const transfrormedData = inputData.map(item => {
            return {
                orgId: req.tokenData.syncOrgId,
                locId: req.tokenData.syncLocId,
                migId: Number(req.tokenData.emrMigId),
                eventId: 93,
                eventName: "Investigation",
                eventTrackId: Number(sequences._eventTrackSeqResp),
                eventDataJson: item.data.flatMap(childItem =>
                    Array.isArray(childItem.child) ? childItem.child.map((childObj, index) => ({
                        "EVENT_ID": 93,
                        "EVENT_TRACK_ID": Number(sequences._eventTrackSeqResp),
                        "MIG_ID": Number(req.tokenData.emrMigId),
                        "ADMN_NO": item.admnNo || null,
                        "UHR_NO": sequences._uhrSeqResp,
                        "UMR_NO": item.UMR ? item.UMR : "",
                        "ORG_ID": req.tokenData.i_orgCd,
                        "LOC_ID": req.tokenData.i_locCd,
                        "DOCTOR_ID": Number((item.docDetails.cd).match(/\d+/)),
                        "SERVICE_ID": childItem.cd ? childItem.cd : "",
                        "INSTRUCATIONS": childObj.instruction ? childObj.instruction : "",
                        "ORDER_TYPE": childObj.ordTyp ? childObj.ordTyp : "",
                        "ORDER_ID": sequences._invOrderId,//childObj.invId ? childObj.invId : "",
                        "ORDER_DT": moment().format("YYYY-MM-DDTHH:mm:ss"),//"2024-11-22T11:20:00",
                        "EVTS_INVS_ORDER_ID": Number(sequences._invOrderId),//690599,
                        "BILL_LOC_ID": null,
                        "I_CONSULTATIONNO": item.visitNo ? item.visitNo : "",
                        //"API_URL": "http://122.169.207.240:444/hisToEmr/api/",
                        "CREATE_DT": item.audit.documentedDt,
                        "SNO": item.data[0].sequenceNo,
                        "OUTSIDE_SRVC_NAME": childObj.isOutside ? childObj.name : null,
                        "STAT": childObj.stat ? "Y" : "N",
                        "IS_FOREIGN_SERVICE": null,
                        "IS_PKG": "",
                        "IS_PROCEDURE": "",
                        "IS_PKGSERVICE": "",//"N"
                        "QUANTITY": "",//0
                        "CREATE_BY": item.audit.documentedBy,
                        "ISAPP_REQ": null,
                        "PKGSERVICECD": null,
                        "I_DOCTOR_ID": item.docDetails.cd ? item.docDetails.cd : "",
                        "PRESCRIBED_DOCTOR_ID": Number((item.docDetails.cd).match(/\d+/)) || null,
                        "PRESCRIBED_DOCTOR_CD": childObj.docDetails.cd || null,
                        "PRESCRIBED_DOCTOR_NAME": childObj.docDetails.name || null
                    })) : []
                )
            };
            //return trans;
        });

        let _mResp = await _mUtils.commonMonogoCall("cm_emr_to_his_syncs", "insertMany", transfrormedData, "", "", "", req.tokenData.dbType)
        if (!(_mResp && _mResp.success)) {
            return ({ success: false, status: 400, desc: _mResp.desc || "", data: [] });
        }
        else {
            return ({ success: true, status: 200, desc: "", data: _mResp.data || [] });
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
}

//medications
async function emr2HisEvent94Trnsfrmd(inputData, req) {
    try {
        const sequenceConfig = [
            { key: '_eventTrackSeqResp', seqName: 'EventTrackId' },
            { key: '_medOrderId', seqName: 'MedOrderId' },
            { key: '_olrIdSeqResp', seqName: 'DoctorId' },
            //{ key: '_docSchTimeIdSeqResp', seqName: 'DocSchTimeId' },
            { key: '_uhrSeqResp', seqName: 'UHR' },
            //{ key: '_patientSeqResp', seqName: 'PatientId' }
        ]
        const sequences = {};
        for (const { key, seqName } of sequenceConfig) {
            const response = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName }, "cm", req);
            if (!(response && response.success)) {
                return ({ success: false, status: 400, desc: response.desc || "", data: response.data || [] });
            }
            sequences[key] = response.data;
        }

        const transfrormedData = inputData.map(item => {
            const trans = {
                orgId: req.tokenData.syncOrgId,
                locId: req.tokenData.syncLocId,
                migId: Number(req.tokenData.emrMigId),
                eventId: 94,
                eventName: "Medication",
                eventTrackId: Number(sequences._eventTrackSeqResp),
                eventDataJson: item.data.flatMap(childItem =>
                    Array.isArray(childItem.child) ? childItem.child.map((childObj, index) => ({
                        "EVTS_MEDICATION_ID": 4117238,
                        "EVENT_ID": 94,
                        "EVENT_TRACK_ID": Number(sequences._eventTrackSeqResp),//618475246,
                        "MIG_ID": Number(req.tokenData.emrMigId),//Number(req.tokenData.emrMigId),
                        "DOCTOR_ID": sequences._olrIdSeqResp,// Number((item.docDetails.i_docCd).match(/\d+/)) sequences._olrIdSeqResp,//42811,
                        "REFERENCE_TYPE_ID": 28,
                        "UHR_NO": sequences._uhrSeqResp,//"UHR0022921426",
                        "MEDICATION_ID": Number(sequences._medOrderId),//2158902,
                        "ORDER_ID": sequences._medOrderId,//"45474644",
                        "DIRECTION": "",
                        "MORNING": null,
                        "AFTERNOON": null,
                        "EVENING": null,
                        "NIGHT": null,
                        "QUANTIY": childObj.qty ? childObj.qty : 0,
                        "DAYS": childObj.days ? childObj.days : 0,
                        "CONTEXT": "",
                        "INSTRUCATIONS": childObj.instruction,//""
                        "I_MEDICATION_ID": "XYKT03",//item_cd
                        "I_ORG_ID": req.tokenData.syncOrgId,
                        "I_LOC_ID": req.tokenData.syncLocId,
                        "I_DOCTOR_ID": childObj.docDetails.cd,//"DM669"
                        "I_UMR_NO": item.UMR,//"UMR197802",
                        "I_CONSULTATIONNO": item.visitNo,//"OP2421324",
                        //"API_URL": "http://183.82.125.9:10002/hisToEmr/api/",
                        "ORDER_DT": item.audit.documentedDt,//"2024-11-21T19:09:42",
                        "FREQUENCY": childObj.freqCd,//"1253",
                        "OUTSIDE_ITEM_NAME": childObj.isOutside ? childObj.medName : "",//"XYKAA MR 4MG TAB",
                        "DOSAGE": childObj.drugDose,//"",
                        "CREATE_DT": item.audit.documentedDt,// "2024-11-21T13:39:42",
                        "ADMN_NO": item.admnNo ? item.admnNo : null,
                        "GENERIC_ID": childObj.genericCd,//null,
                        "ROUTE_MEDICATION": item.routeName,//"0",
                        "MEDICATION_TYPE": childObj.medFormTypeCd,//"C",
                        "REFILL": "0",
                        "FREQ_DESC": childObj.freqDesc,//"Twice a Day (1 - 0 - 1)",
                        "CLINIC_NAME": "",
                        "NURSESTAT_CD": null,
                        "FLAG": "I",
                        "STOP_MEDI": null,
                        "STOP_MEDI_DESC": null,
                        "MEDI_ORDER_ID": 4129970,
                        "ITEM_ORDER_FROM": childObj.medFormTypeCd,//"I",
                        "I_CREATE_BY": null,
                        "STOCK_POINT": "Other",
                        "STOCK_POINT_REMARKS": "",
                        "SNO": item.data[0].sequenceNo,
                        "UMR_NO": item.UMR,//"UMR197802"
                    })) : []
                )
            }
            return trans;
        });

        let _mResp = await _mUtils.commonMonogoCall("cm_emr_to_his_syncs", "insertMany", transfrormedData, "", "", "", req.tokenData.dbType)
        if (!(_mResp && _mResp.success)) {
            return ({ success: false, status: 400, desc: _mResp.desc || "", data: [] });
        }
        else {
            return ({ success: true, status: 200, desc: "", data: _mResp.data || [] });
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
}

async function emr2HisEvent93Trnsfrm(inputData, req) {
    try {
        const transfrormedData = [];
        for (const item of inputData) {
            for (const childItem of item.data) {
                if (Array.isArray(childItem.child)) {
                    for (const childObj of childItem.child) {
                        let _filter = { "filter": { "code": item.visitNo },"selectors": "-audit -history" }
                        let _mAppResp = await _mUtils.commonMonogoCall("cm_appointments", "find", _filter, "", "", "", req.tokenData.dbType)
                        if (!(_mAppResp && _mAppResp.success)) {
                            return ({ success: false, status: 400, desc: _mAppResp.desc || "Error while getting appoitmentId from Appointments", data: [] });
                        }
                        let ORDER_ID = _mAppResp.data[0].appointmentId;
                        let I_CONSULTATIONNO = _mAppResp.data[0].consultationNo || "";
                        const _eventTrackSeqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'EventTrackId' }, "cm", req);
                        const _invOrderId = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'InvOrderId' }, "cm", req);
                        const _uhrSeqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'UHR' }, "cm", req);
                        const _olrIdSeqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'DoctorId' }, "cm", req);

                        if (!(_eventTrackSeqResp.success && _invOrderId.success && _uhrSeqResp.success)) {
                            return ({ success: false, status: 400, desc: response.desc || "Error in generating sequences", data: [] });
                        }
                        transfrormedData.push({
                            orgId: req.tokenData.syncOrgId,
                            locId: req.tokenData.syncLocId,
                            migId: Number(req.tokenData.emrMigId),
                            eventId: 93,
                            eventName: "Investigation",
                            eventTrackId: Number(_eventTrackSeqResp.data),
                            eventDataJson: [{
                                "EVENT_ID": 93,
                                "EVENT_TRACK_ID": Number(_eventTrackSeqResp.data),
                                "MIG_ID": Number(req.tokenData.emrMigId),
                                "ADMN_NO": item.admnNo || null,
                                "UHR_NO": _uhrSeqResp.data,
                                "UMR_NO": item.UMR ? item.UMR : "",
                                "ORG_ID": req.tokenData.i_orgCd,
                                "LOC_ID": req.tokenData.i_locCd,
                                "DOCTOR_ID": _olrIdSeqResp.data,// Number((item.docDetails.i_docCd).match(/\d+/)),
                                "SERVICE_ID":childObj.i_cd || "",// childItem.cd ? childItem.cd : "",
                                "INSTRUCATIONS": childObj.instruction ? childObj.instruction : "",
                                "ORDER_TYPE": childObj.ordTyp ? childObj.ordTyp : "",
                                "ORDER_ID": ORDER_ID,//_invOrderId.data,
                                "ORDER_DT": item.audit.documentedDt,//moment().format("YYYY-MM-DDTHH:mm:ss"),
                                "EVTS_INVS_ORDER_ID": Number(_invOrderId.data),
                                "BILL_LOC_ID": null,
                                "I_CONSULTATIONNO": I_CONSULTATIONNO || item.visitNo ? item.visitNo : "",
                                "API_URL": req.tokenData.syncApiUrl,
                                "CREATE_DT": item.audit.documentedDt,
                                "SNO": item.data[0].sequenceNo,
                                "OUTSIDE_SRVC_NAME": childObj.isOutside ? childObj.name : null,
                                "STAT": childObj.stat ? "Y" : "N",
                                "IS_FOREIGN_SERVICE": null,
                                "IS_PKG": "",
                                "IS_PROCEDURE": "",
                                "IS_PKGSERVICE": "",
                                "QUANTITY": "",
                                "CREATE_BY": (item.audit.documentedBy).length > 14 ? (item.audit.documentedBy).slice(0, 14) : item.audit.documentedBy,
                                "ISAPP_REQ": null,
                                "PKGSERVICECD": null,
                                "I_DOCTOR_ID": item.docDetails.i_docCd,//item.docDetails.cd ? item.docDetails.cd : "",
                                "PRESCRIBED_DOCTOR_ID": null,
                                "PRESCRIBED_DOCTOR_CD": null,
                                "PRESCRIBED_DOCTOR_NAME": null
                            }]
                        });
                    }
                }
            }
        }
        let _mResp = await _mUtils.commonMonogoCall("cm_emr_to_his_syncs", "insertMany", transfrormedData, "", "", "", req.tokenData.dbType)
        if (!(_mResp && _mResp.success)) {
            return ({ success: false, status: 400, desc: _mResp.desc || "error during insertion", data: [] });
        }
        else {
            return ({ success: true, status: 200, desc: "", data: _mResp.data || [] });
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
}

async function emr2HisEvent94Trnsfrm(inputData, req) {
    try {
        const transfrormedData = [];
        for (const item of inputData) {
            for (const childItem of item.data) {
                if (Array.isArray(childItem.child)) {
                    for (const childObj of childItem.child) {
                        let _filter = { "filter": { "code": item.visitNo },"selectors": "-audit -history" }
                        let _mAppResp = await _mUtils.commonMonogoCall("cm_appointments", "find", _filter, "", "", "", req.tokenData.dbType)
                        if (!(_mAppResp && _mAppResp.success)) {
                            return ({ success: false, status: 400, desc: _mAppResp.desc || "Error while getting appoitmentId from Appointments", data: [] });
                        }
                        let ORDER_ID = _mAppResp.data[0].appointmentId;
                        let I_CONSULTATIONNO = _mAppResp.data[0].consultationNo;
                        const _eventTrackSeqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'EventTrackId' }, "cm", req);
                        const _medOrderId = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'MedOrderId' }, "cm", req);
                        const _uhrSeqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'UHR' }, "cm", req);
                        const _olrIdSeqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'DoctorId' }, "cm", req);

                        if (!(_eventTrackSeqResp.success && _medOrderId.success && _uhrSeqResp.success)) {
                            return ({ success: false, status: 400, desc: response.desc || "Error in generating sequences", data: [] });
                        }
                        transfrormedData.push({
                            orgId: req.tokenData.syncOrgId,
                            locId: req.tokenData.syncLocId,
                            migId: Number(req.tokenData.emrMigId),
                            eventId: 94,
                            eventName: "Medication",
                            eventTrackId: Number(_eventTrackSeqResp.data),
                            eventDataJson: [{
                                "EVTS_MEDICATION_ID": Number(_medOrderId.data),
                                "EVENT_ID": 94,
                                "EVENT_TRACK_ID": Number(_eventTrackSeqResp.data),
                                "MIG_ID": Number(req.tokenData.emrMigId),
                                "DOCTOR_ID": _olrIdSeqResp.data,//Number((item.docDetails.i_docCd).match(/\d+/)),
                                "REFERENCE_TYPE_ID": 0,
                                "UHR_NO": _uhrSeqResp.data,
                                "MEDICATION_ID": Number(_medOrderId.data),
                                "ORDER_ID": ORDER_ID,//_medOrderId.data,
                                "DIRECTION": "",
                                "MORNING": null,
                                "AFTERNOON": null,
                                "EVENING": null,
                                "NIGHT": null,
                                "QUANTIY": childObj.qty ? childObj.qty : 0,
                                "DAYS": childObj.days ? childObj.days : 0,
                                "CONTEXT": "",
                                "INSTRUCATIONS": childObj.instruction,
                                "I_MEDICATION_ID": childObj.i_cd || "",//"XYKT03",//item_cd
                                "I_ORG_ID": req.tokenData.i_orgCd,//req.tokenData.syncOrgId,
                                "I_LOC_ID": req.tokenData.i_locCd,//req.tokenData.syncLocId,
                                "I_DOCTOR_ID": item.docDetails.i_docCd,// childObj.docDetails.cd,
                                "I_UMR_NO": item.UMR ? item.UMR : "",
                                "I_CONSULTATIONNO": I_CONSULTATIONNO || item.visitNo ? item.visitNo : "",
                                "API_URL": req.tokenData.syncApiUrl,//"http://183.82.125.9:10002/hisToEmr/api/",
                                "ORDER_DT": item.audit.documentedDt,
                                "FREQUENCY": childObj.freqCd,
                                "OUTSIDE_ITEM_NAME": childObj.isOutside ? childObj.medName : "",
                                "DOSAGE": childObj.drugDose,
                                "CREATE_DT": item.audit.documentedDt,
                                "ADMN_NO": item.admnNo ? item.admnNo : null,
                                "GENERIC_ID": null,
                                "ROUTE_MEDICATION": item.routeName,
                                "MEDICATION_TYPE": childObj.medFormTypeCd,
                                "REFILL": "",
                                "FREQ_DESC": childObj.freqDesc,
                                "CLINIC_NAME": "",
                                "NURSESTAT_CD": null,
                                "FLAG": "",
                                "STOP_MEDI": null,
                                "STOP_MEDI_DESC": null,
                                "MEDI_ORDER_ID":Number(_medOrderId.data),
                                "ITEM_ORDER_FROM": childObj.medFormTypeCd,
                                "I_CREATE_BY": null,
                                "STOCK_POINT": "",
                                "STOCK_POINT_REMARKS": "",
                                "SNO": item.data[0].sequenceNo,
                                "UMR_NO": item.UMR ? item.UMR : "",
                            }]
                        });
                    }
                }
            }
        }
        let _mResp = await _mUtils.commonMonogoCall("cm_emr_to_his_syncs", "insertMany", transfrormedData, "", "", "", req.tokenData.dbType)
        if (!(_mResp && _mResp.success)) {
            return ({ success: false, status: 400, desc: _mResp.desc || "error during insertion", data: [] });
        }
        else {
            return ({ success: true, status: 200, desc: "", data: _mResp.data || [] });
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
}

module.exports = {
    emr2HisEvent111Trnsfrm,
    emr2HisEvent93Trnsfrm,
    emr2HisEvent94Trnsfrm
}