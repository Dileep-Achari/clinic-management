const cv19VaccineReqQuetions=[
    {
      "id": 1,
      "type": "radio",
      "question": "Are you feeling sick today?",
      "modelValue": "",
      "answerValues": [
        {
          "id": 1,
          "Name": "Yes",
          "Value": "Y"
        },
        {
          "id": 2,
          "Name": "No",
          "Value": "N"
        }
      ],
      "remarks": "",
      "isRemarksEnable": true
    },
    {
      "id": 2,
      "type": "radio",
      "question": "In the last 14 days, have you had a COVID-19 test or been told by a health care provider or health department to isolate or quarantine at home due to COVID-19 infection or exposure?",
      "modelValue": "",
      "answerValues": [
        {
          "id": 1,
          "Name": "Yes",
          "Value": "Y"
        },
        {
          "id": 2,
          "Name": "No",
          "Value": "N"
        }
      ],
      "remarks": "",
      "isRemarksEnable": true
    },
    {
      "id": 3,
      "type": "radio",
      "question": "Have you been treated with antibody therapy for COVID-19 in the past 90 days (3 months)?   If yes, when did you receive the last dose as furnished on document?",
      "modelValue": "",
      "answerValues": [
        {
          "id": 1,
          "Name": "Yes",
          "Value": "Y"
        },
        {
          "id": 2,
          "Name": "No",
          "Value": "N"
        }
      ],
      "remarks": "",
      "isRemarksEnable": true
    },
    {
      "id": 4,
      "type": "radio",
      "question": "Have you ever had a serious allergic reaction?",
      "modelValue": "",
      "answerValues": [
        {
          "id": 1,
          "Name": "Yes",
          "Value": "Y"
        },
        {
          "id": 2,
          "Name": "No",
          "Value": "N"
        }
      ],
      "remarks": "",
      "isRemarksEnable": true
    },
    {
      "id": 5,
      "type": "radio",
      "question": "Have you had any vaccines in the past 28 days?   If yes, how long ago was your most recent vaccine?",
      "modelValue": "",
      "answerValues": [
        {
          "id": 1,
          "Name": "Yes",
          "Value": "Y"
        },
        {
          "id": 2,
          "Name": "No",
          "Value": "N"
        }
      ],
      "remarks": "",
      "isRemarksEnable": true
    },
    {
      "id": 6,
      "type": "radio",
      "question": "Are you pregnant or considering becoming pregnant?",
      "modelValue": "",
      "answerValues": [
        {
          "id": 1,
          "Name": "Yes",
          "Value": "Y"
        },
        {
          "id": 2,
          "Name": "No",
          "Value": "N"
        }
      ],
      "remarks": "",
      "isRemarksEnable": true
    },
    {
      "id": 7,
      "type": "radio",
      "question": "Are you a nursing mother?",
      "modelValue": "",
      "answerValues": [
        {
          "id": 1,
          "Name": "Yes",
          "Value": "Y"
        },
        {
          "id": 2,
          "Name": "No",
          "Value": "N"
        }
      ],
      "remarks": "",
      "isRemarksEnable": true
    },
    {
      "id": 8,
      "type": "radio",
      "question": "Are you on any medication for a long-standing disease?   If yes please tell me the name of the disease",
      "modelValue": "",
      "answerValues": [
        {
          "id": 1,
          "Name": "Yes",
          "Value": "Y"
        },
        {
          "id": 2,
          "Name": "No",
          "Value": "N"
        }
      ],
      "remarks": "",
      "isRemarksEnable": true
    },
    {
      "id": 9,
      "type": "radio",
      "question": "Are you taking radiotherapy?",
      "modelValue": "",
      "answerValues": [
        {
          "id": 1,
          "Name": "Yes",
          "Value": "Y"
        },
        {
          "id": 2,
          "Name": "No",
          "Value": "N"
        }
      ],
      "remarks": "",
      "isRemarksEnable": true
    }
  ]
  const vaccineNames=[
    {
        "ENTITY_ID": 1486,
        "ENTITY_VALUE_ID": 1,
        "ENTITY_CD": "VACCNAME",
        "ENTITY_NAME": "Vaccine Name",
        "ENTITY_DESC": "Vaccine Name",
        "ENTITY_VALUE_CD": "COVISHEILD",
        "ENTITY_VALUE_NAME": "COVISHEILD",
        "ENTITY_VALUE_DESC": "COVISHEILD",
        "VAL1": "0",
        "VAL2": "",
        "VAL3": ""
    },
    {
        "ENTITY_ID": 1486,
        "ENTITY_VALUE_ID": 2,
        "ENTITY_CD": "VACCNAME",
        "ENTITY_NAME": "Vaccine Name",
        "ENTITY_DESC": "Vaccine Name",
        "ENTITY_VALUE_CD": "COVAXIN",
        "ENTITY_VALUE_NAME": "COVAXIN",
        "ENTITY_VALUE_DESC": "COVAXIN",
        "VAL1": "1",
        "VAL2": "",
        "VAL3": ""
    },
    {
        "ENTITY_ID": 1486,
        "ENTITY_VALUE_ID": 3,
        "ENTITY_CD": "VACCNAME",
        "ENTITY_NAME": "Vaccine Name",
        "ENTITY_DESC": "Vaccine Name",
        "ENTITY_VALUE_CD": "SPUTNIK",
        "ENTITY_VALUE_NAME": "SPUTNIK",
        "ENTITY_VALUE_DESC": "SPUTNIK",
        "VAL1": "2",
        "VAL2": "",
        "VAL3": ""
    }
]

let loc_1004=[
  {
    "PARAMETERCD":"LPR1",
    "PARAMETERDESC":"HAEMOGLOBIN",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 1, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR4",
    "PARAMETERDESC":"WBC COUNT",
    "SERVICEGROUPCD":"PAT",
    "SERVICEGROUPNAME":"PATHOLOGY",
    "ORDER": 2, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR5",
    "PARAMETERDESC":"PLATELET COUNT",
    "SERVICEGROUPCD":"PAT",
    "SERVICEGROUPNAME":"PATHOLOGY",
    "ORDER": 3, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR989",
    "PARAMETERDESC":"SERUM SODIUM",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 4, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR990",
    "PARAMETERDESC":"SERUM POTASSIUM",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 5, 
    "ENABLED": "true"
    
  },
  {
    "PARAMETERCD":"LPR991",
    "PARAMETERDESC":"SERUM CHLORIDE",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 6, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR1450",
    "PARAMETERDESC":"SERUM CREATININE",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 7, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR774",
    "PARAMETERDESC":"BLOOD UREA",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 8, 
    "ENABLED": "true"
  },
  {	"PARAMETERCD":"LPR61",
    "PARAMETERDESC":"SERUM URIC ACID",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 9, 
    "ENABLED": "true"
    
  },
  {	"PARAMETERCD":"LPR59",
    "PARAMETERDESC":"SERUM CALCIUM",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 10, 
    "ENABLED": "true"
    
  },
  {
    "PARAMETERCD":"LPR62",
    "PARAMETERDESC":"SERUM MAGNESIUM",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 11, 
    "ENABLED": "true"
  },
  {	"PARAMETERCD":"LPR35",
    "PARAMETERDESC":"RANDOM BLOOD SUGAR",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 12, 
    "ENABLED": "true"
  },
  {	"PARAMETERCD":"LPR37",
    "PARAMETERDESC":"FASTING BLOOD GLUCOSE",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 13, 
    "ENABLED": "true"
  },
  {	"PARAMETERCD":"LPR39",
    "PARAMETERDESC":"POST PRANDIAL BLOOD GLUCOSE",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 14, 
    "ENABLED": "true"
  },
  {	"PARAMETERCD":"LPR219",
    "PARAMETERDESC":"HBA1C",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 15, 
    "ENABLED": "true"
  },
  
  {
    "PARAMETERCD":"LPR1835",
    "PARAMETERDESC":"D-DIMER",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 16, 
    "ENABLED": "true"
  },
  {
     "PARAMETERCD":"LPR65",
    "PARAMETERDESC":"LDH",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 17, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR1838",
    "PARAMETERDESC":"CRP QUANTITATIVE",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 18, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR1839",
    "PARAMETERDESC":"CRP-PENTRA",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 19, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR68",
    "PARAMETERDESC":"FERRITIN",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 20, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR1819",
    "PARAMETERDESC":"IL-6 (INTERLEUKIN)",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 21, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR994",
    "PARAMETERDESC":"SERUM TROP-T HS",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 22, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR47",
    "PARAMETERDESC":"TOTAL BILIRUBIN",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 23, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR52",
    "PARAMETERDESC":"AST (SGOT)",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 24, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR51",
    "PARAMETERDESC":"ALT (SGPT)",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 25, 
    "ENABLED": "true"
  },
  {	
    "PARAMETERCD":"LPR1241",
    "PARAMETERDESC":"GGT",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 26, 
    "ENABLED": "true"
    
  },
  {
    "PARAMETERCD":"LPR53",
    "PARAMETERDESC":"TOTAL PROTEIN",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 27, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR54",
    "PARAMETERDESC":"SERUM ALBUMIN",
    "SERVICEGROUPCD":"BIO",
    "SERVICEGROUPNAME":"BIOCHEMISTRY",
    "ORDER": 28, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR41",
    "PARAMETERDESC":"TOTAL CHOLESTEROL (TOTAL)",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 29, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR44",
    "PARAMETERDESC":"SERUM LDL DIRECT",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 30, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR43",
    "PARAMETERDESC":"SERUM HDL DIRECT",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 31, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR42",
    "PARAMETERDESC":"TRIGLYCERIDES",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 32, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR89",
    "PARAMETERDESC":"SERUM TSH",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 33, 
    "ENABLED": "true"
  },
  {
    "PARAMETERCD":"LPR468",
    "PARAMETERDESC":"SERUM PSA (TOTAL)",
    "SERVICEGROUPCD":"",
    "SERVICEGROUPNAME":"",
    "ORDER": 34, 
    "ENABLED": "true"
  },
]
loc_1185=[	
		{
			"PARAMETERCD":"LPR1",
			"PARAMETERDESC":"HAEMOGLOBIN",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 1, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR4",
			"PARAMETERDESC":"WBC COUNT",
			"SERVICE_CODE":"PAT0078",
			"SERVICENAME":"COMPLETE BLOOD COUNT",
			"ORDER": 2, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR5",
			"PARAMETERDESC":"PLATELET COUNT",
			"SERVICE_CODE":"PAT0078",
			"SERVICENAME":"COMPLETE BLOOD COUNT",
			"ORDER": 3, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR32",
			"PARAMETERDESC":"SERUM SODIUM",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 4, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR33",
			"PARAMETERDESC":"SERUM POTASSIUM",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 5, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR34",
			"PARAMETERDESC":"SERUM CHLORIDE",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 6, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR31",
			"PARAMETERDESC":"SERUM CREATININE",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 7, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR774",
			"PARAMETERDESC":"BLOOD UREA",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 8, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR61",
			"PARAMETERDESC":"SERUM URIC ACID",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 9, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR59",
			"PARAMETERDESC":"SERUM CALCIUM",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 10, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR62",
			"PARAMETERDESC":"SERUM MAGNESIUM",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 11, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR35",
			"PARAMETERDESC":"RANDOM BLOOD SUGAR",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 12, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR37",
			"PARAMETERDESC":"FASTING BLOOD GLUCOSE",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 13, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR39",
			"PARAMETERDESC":"POST PRANDIAL BLOOD GLUCOSE",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 14, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR2797",
			"PARAMETERDESC":"HBA1C",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 15, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR3075",
			"PARAMETERDESC":"D-DIMER",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 16, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR65",
			"PARAMETERDESC":"LDH",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 17, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR96",
			"PARAMETERDESC":"CRP - QUNTITATIVE",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 18, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR96",
			"PARAMETERDESC":"CRP - PENTRA",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 19, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR68",
			"PARAMETERDESC":"FERRITIN",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 20, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"'-",
			"PARAMETERDESC":"IL-6 (INTERLEUKIN)",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 21, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR849",
			"PARAMETERDESC":"SERUM TROP-T HS",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 22, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR47",
			"PARAMETERDESC":"TOTAL BILIRUBIN",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 23, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR52",
			"PARAMETERDESC":"AST (SGOT)",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 24, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR51",
			"PARAMETERDESC":"ALT (SGPT)",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 25, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR191",
			"PARAMETERDESC":"GGT",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 26, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR53",
			"PARAMETERDESC":"TOTAL PROTEINS",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 27, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR206",
			"PARAMETERDESC":"SERUM ALBUMIN",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 28, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR41",
			"PARAMETERDESC":"TOTAL CHOLESTEROL (TOTAL)",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 29, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR44",
			"PARAMETERDESC":"SERUM LDL DIRECT",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 30, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR43",
			"PARAMETERDESC":"SERUM HDL DIRECT",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 31, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR42",
			"PARAMETERDESC":"TRIGLYCERIDES",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 32, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR89",
			"PARAMETERDESC":"SERUM TSH",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 33, 
			"ENABLED": "true"
		},
		{
			"PARAMETERCD":"LPR231",
			"PARAMETERDESC":"SERUM PSA (TOTAL)",
			"SERVICE_CODE":"",
			"SERVICENAME":"",
			"ORDER": 34, 
			"ENABLED": "true"
    }
  ]
  
  loc_1246=[
  {
    "PARAMETERCD": "LPR842",
    "PARAMETERDESC": "HEMOGLOBIN",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "1",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR1604",
    "PARAMETERDESC": "WBC COUNT",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "2",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR1212",
    "PARAMETERDESC": "PLATELET COUNT",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "3",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR1357",
    "PARAMETERDESC": "SERUM SODIUM",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "4",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR1219",
    "PARAMETERDESC": "SERUM POTASSIUM",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "5",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR472",
    "PARAMETERDESC": "SERUM CHLORIDE",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "6",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR529",
    "PARAMETERDESC": "SERUM CREATININE",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "7",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR319",
    "PARAMETERDESC": "BLOOD UREA",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "8",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR1501",
    "PARAMETERDESC": "SERUM URIC ACID",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "9",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR366",
    "PARAMETERDESC": "SERUM CALCIUM",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "10",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR1040",
    "PARAMETERDESC": "SERUM MAGNESIUM",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "11",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR2377",
    "PARAMETERDESC": "RANDOM BLOOD SUGAR",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "12",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR2365",
    "PARAMETERDESC": "FASTING BLOOD GLUCOSE",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "13",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR2375",
    "PARAMETERDESC": "POST PRANDIAL BLOOD GLUCOSE",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "14",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR810",
    "PARAMETERDESC": "HBA1C",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "15",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR555",
    "PARAMETERDESC": "D-DIMER",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "16",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR983",
    "PARAMETERDESC": "LDH",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "17",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR530",
    "PARAMETERDESC": "CRP - QUNTITATIVE",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "18",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "",
    "PARAMETERDESC": "CRP - PENTRA",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "19",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR2407",
    "PARAMETERDESC": "FERRITIN",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "20",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR7694",
    "PARAMETERDESC": "IL-6 (INTERLEUKIN)",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "21",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR6585",
    "PARAMETERDESC": "SERUM TROP-T HS",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "22",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR311",
    "PARAMETERDESC": "TOTAL BILIRUBIN",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "23",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR1345",
    "PARAMETERDESC": "AST (SGOT)",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "24",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR1346",
    "PARAMETERDESC": "ALT (SGPT)",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "25",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "",
    "PARAMETERDESC": "GGT",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "26",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR1463",
    "PARAMETERDESC": "TOTAL PROTEINS",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "27",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR94",
    "PARAMETERDESC": "SERUM ALBUMIN",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "28",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR1452",
    "PARAMETERDESC": "TOTAL CHOLESTEROL (TOTAL)",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "29",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR984",
    "PARAMETERDESC": "SERUM LDL DIRECT",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "30",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR873",
    "PARAMETERDESC": "SERUM HDL DIRECT",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "31",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR1481",
    "PARAMETERDESC": "TRIGLYCERIDES",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "32",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR1486",
    "PARAMETERDESC": "SERUM TSH",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "33",
    "ENABLED": "true"
  },
  {
    "PARAMETERCD": "LPR1475",
    "PARAMETERDESC": "SERUM PSA (TOTAL)",
    "SERVICE_CODE": "",
    "SERVICENAME": "",
    "ORDER": "34",
    "ENABLED": "true"
  }
]
  
  

  let orgParams=function(locid){
    if(locid==1185){
      return loc_1185
    }
    else if(locid==1004){
      return loc_1004
    }
	 else if(locid==1088){
      return loc_1004
    }
    else if(locid==1246){
      return loc_1246
    }
    else {
      return loc_1004
    }

  }

module.exports={
    cv19VaccineReqQuetions,vaccineNames,orgParams
}