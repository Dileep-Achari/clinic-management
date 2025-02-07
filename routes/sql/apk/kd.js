'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "KD_OP_API";
const dbSchema = require("../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
const responseChange = require("../../../db-config/helper-methods/sql/response-change");
const generateParams = require("../../../db-config/helper-methods/sql/generate-parameters");
const mapper = require("../../../db-config/mapper");
const token = require("../../../services/token");

router.get('/', (req, res) => {
    res.json(200)
});

function verifyToken(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    else {
        if (req.url === "/genToken") {
            next();
        }
        else {
            if (!req.headers.authtoken) {
                res.status(407).send({
                    status: "INVALID-REQUEST",
                    details: "Request headers does not contain 'authtoken'.",
                });
            }
            else {
                token.verifyToken(req.headers.authtoken).then((data) => {
                    if (!req.body) req.body = {};
                    req.body.IP_SESSION_ID = data.IP_SESSION_ID;
                    next();
                }).catch((error) => {
                    res.status(401).send({
                        status: "FAILED",
                        details: "Authentication failed, invalid token",
                    });
                });
            }
        }
    }
}

router.all('/*', verifyToken, (req, res, next) => {
    try {
        req.cParams = {
            "URL": req.url.substr(1, req.url.length),
            "IS_MULTI_RESULTSET": req.headers["x-multi-resultset"] || "N",
            "IS_LOAD_AJAX": req.headers["x-load-ajax"] || "N",
            "MODULE": MODULE_NAME
        };
        req.body = generateParams(req.body, req.cParams);
        next();
    }
    catch (ex) {
        res.status(400).send({ "ERROR": "ERROR_WHILE_PREPARECPARAMS", "MESSAGE": ex.message });
    }
});

/** Write token generation method */
router.post('/genToken', (req, res) => {
    if (req.body.IP_SESSION_ID && req.body.ORG_ID && req.body.LOC_ID) {
        res.send(token.createToken({ IP_SESSION_ID: req.body.IP_SESSION_ID, ORG_ID: 2, LOC_ID: 1 }));
    }
    else {
        res.send("acepted paramates are IP_SESSION_ID, ORG_ID, LOC_ID");
    }
});


/* To get All Specialities 
 * params {}
*/
router.post('/getAllSpecialities', (req, res) => {
    mapper(dbSchema.getAllSpecialities, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/* To get all specializations 
 * params {}
*/
router.post('/getAllSpecialization', (req, res) => {
    mapper(dbSchema.getAllSpecialization, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/* To get all Doctors 
 * params {}
*/
router.post('/getAllDoctors', (req, res) => {
    mapper(dbSchema.getAllDoctors, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To get  Specializations based on SpecialityId
 *  params { "spcltyId" : 4 }
**/
router.post('/getSpecilizationBySpeciality', (req, res) => {
    mapper(dbSchema.getSpecilizationBySpeciality, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To get  Doctors based on Speciality Id
 *  params { "spcltyId" : 4 }
**/
router.post('/getDoctorsBySplciality', (req, res) => {
    mapper(dbSchema.getDoctorsBySplciality, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To get  Doctors based on Specialization Id
 *  params { "spclzId" : 72 }
**/
router.post('/getDoctorsBySplcialization', (req, res) => {
    mapper(dbSchema.getDoctorsBySplcialization, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To get  Doctors based on Doctor Id
 *  params { "docId" : 111 }
**/
router.post('/getDoctorById', (req, res) => {
    mapper(dbSchema.getDoctorById, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To get Patient Details based on Unique Id(UMR)
 *  params { "uniqueId" : "UMR0000693850" }
**/
router.post('/getPatientByUniqueId', (req, res) => {
    mapper(dbSchema.getPatientByUniqueId, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To get Patient Details based on Mobile No
 *  params { "mobileNo" : "9866554343" }
**/
router.post('/getPatientByMobile', (req, res) => {
    mapper(dbSchema.getPatientByMobile, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To get Slot Details By OLR_ID
 *  params { "id"      : 7256,
 *           "aptDate" : "7/1/2019"
 *         }
**/
router.post('/getSlots', (req, res) => {
    mapper(dbSchema.getSlots, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To Book  Appointment as a Guest User you can pass patId=0,   To Book  Appointment as a Register User you can pass patId=Patient Id
 *  params { "id"        : 106669240,
 *           "patName"   : "RAMAKRISHNA REDDY U",
 *           "mobileNo"  : "9866554343",
 *           "emailId"   : "",
 *           "genderCd"  : "M",
 *           "stateName" : "Madya Pradesh",
 *           "cityName"  : "Hyderabad",
 *           "patId"     : 692773
 *         }
**/
router.post('/bookAppointment', (req, res) => {
    mapper(dbSchema.bookAppointment, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To Get the Slot Information
 *  params { "id" : 106669242 }
**/
router.post('/getSlotInfo', (req, res) => {
    mapper(dbSchema.getSlotInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To Get Speciality based on Speciality Id
 *  params { "spcltyId" : 4 }
**/
router.post('/getSpecialityById', (req, res) => {
    mapper(dbSchema.getSpecialityById, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To Get Specialization based on Specialization Id
 *  params { "splczId" : 72 }
**/
router.post('/getSpecilizationById', (req, res) => {
    mapper(dbSchema.getSpecilizationById, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To Get Speciality based on Specialization Id
 *  params { "spclzId" : 72 }
**/
router.post('/getSpecialityBySpeclzId', (req, res) => {
    mapper(dbSchema.getSpecialityBySpeclzId, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To get Patient Details based on Unique Id and Mobile No
 *  params { "mobileNo" : "8142094666",
 *           "uniqueId"  : "UMR0000693847"
 *         }
**/
router.post('/getPatientByUniqueIdMobileNo', (req, res) => {
    mapper(dbSchema.getPatientByUniqueIdMobileNo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To Get Doctor Details based on Consultant No or Slot Id
 *  params { "consultNo" : "CONS654987" }
**/
router.post('/getDocDetByConsultNo', (req, res) => {
    mapper(dbSchema.getDocDetByConsultNo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To Get Doctor Details based on IP No
 *  params { "patIpNo" : "IP227858" }
**/
router.post('/getDocDetByPatIpNo', (req, res) => {
    mapper(dbSchema.getDocDetByPatIpNo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To get Patient Details by Unique Id
 *  params { "uniqueId" : "UMR0000693847" }
**/
router.post('/getPatientByUniqueId', (req, res) => {
    mapper(dbSchema.getPatientByUniqueId, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To Get Consultations Details By Unique Id
 *  params { "uniqueId" : "UMR0000693847" }
**/
router.post('/getConsltDtlsByUniqueId', (req, res) => {
    mapper(dbSchema.getConsltDtlsByUniqueId, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To Get Consultations Details By Unique Id
 *  params { "mobileNo" : "8142094666" }
**/
router.post('/getUmrDtlsFrmMobNo', (req, res) => {
    mapper(dbSchema.getUmrDtlsFrmMobNo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/*
 *  To Get all OP consultations based on  unique id , mobile no , patient Type and   Request Type
 *  To Get all IP Details based on unique id , mobile no  , patient Type and   Request Type
 *  To Get all last generated Op Consultation based on unique id ,mobile no  , patient Type and   Request Type
 *  To Get all last generated IP Details based on unique id ,mobile no  , patient Type and   Request Type
 * 
 *  params { "mobileNo" : "8142094666",
 *           "uniqueId" : "UMR0000693847",
 *           "patType"  : "OP",
 *           "reqType"  : "A"
 *         }
**/
router.post('/getOpOrIpDtlsByUniqueIdMobileNo', (req, res) => {
    mapper(dbSchema.getOpOrIpDtlsByUniqueIdMobileNo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;