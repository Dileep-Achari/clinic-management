
const D3Node = require('d3-node')

const pdf = require("pdf-creator-node");
const path = require('path');
var UnderscoreTemplate = require('underscore.template');
var _ = require('underscore');
const moment = require('moment');
const fs = require('fs');


var _dummyText = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book`;

/*Data prepare function */

var emrLabResults_new = [
  {
    "plg_id": "1",
    "profile_group_cd": "BIO236",
    "profile_name": "Lipid Profile",
    "profile_name_desc": "A pattern of lipids in the blood. A lipid profile usually includes the levels of total cholesterol, high-density lipoprotein (HDL) cholesterol, triglycerides, and the calculated low-density lipoprotein (LDL) 'cholesterol.",
    "group_display_order": 1,
    "param_display_order": 1,
    "paramcd": "LPR2935",
    "param_name": "HDL Cholesterol",
    "param_short_name": "HDL Cholesterol",
    "normal_min_val": "30",
    "normal_max_val": "70",
    "normal_val_ranges": "30 to 70 mg/dL",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "1",
    "profile_group_cd": "BIO236",
    "profile_name": "Lipid Profile",
    "profile_name_desc": "A pattern of lipids in the blood. A lipid profile usually includes the levels of total cholesterol, high-density lipoprotein (HDL) cholesterol, triglycerides, and the calculated low-density lipoprotein (LDL) 'cholesterol.",
    "paramcd": "LPR44",
    "group_display_order": 1,
    "param_display_order": 2,
    "param_name": "LDL Cholesterol",
    "param_short_name": "LDL Cholesterol",
    "normal_min_val": "0",
    "normal_max_val": "130",
    "normal_val_ranges": "Less than 130 mg/dL",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "1",
    "profile_group_cd": "BIO236",
    "profile_name": "Lipid Profile",
    "profile_name_desc": "A pattern of lipids in the blood. A lipid profile usually includes the levels of total cholesterol, high-density lipoprotein (HDL) cholesterol, triglycerides, and the calculated low-density lipoprotein (LDL) 'cholesterol.",
    "group_display_order": 1,
    "param_display_order": 3,
    "paramcd": "LPR42",
    "param_name": "Triglycerides Serum",
    "param_short_name": "Triglycerides Serum",
    "normal_min_val": "50",
    "normal_max_val": "150",
    "normal_val_ranges": "( 50 - 150 mg/dl )",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "1",
    "profile_group_cd": "BIO236",
    "profile_name": "Lipid Profile",
    "profile_name_desc": "A pattern of lipids in the blood. A lipid profile usually includes the levels of total cholesterol, high-density lipoprotein (HDL) cholesterol, triglycerides, and the calculated low-density lipoprotein (LDL) 'cholesterol.",
    "group_display_order": 1,
    "param_display_order": 4,
    "paramcd": "LPR45",
    "param_name": "VLDL",
    "param_short_name": "VLDL",
    "normal_min_val": "0",
    "normal_max_val": "40",
    "normal_val_ranges": "0- < 40 mg/dl",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "2",
    "profile_group_cd": "BIO0097",
    "profile_name": "Thyroid Profile",
    "profile_name_desc": "Thyroid Profile Total is a group of tests that are done together to detect or diagnose thyroid diseases. It measures the levels of the following three hormones in the blood: Thyroid Stimulating Hormone (TSH), Thyroxine (T4) - Total and TriIodothyronine (T3) - Total.",
    "group_display_order": 2,
    "param_display_order": 1,
    "paramcd": "LPR87",
    "param_name": "T3",
    "param_short_name": "T3",
    "normal_min_val": "80",
    "normal_max_val": "230",
    "normal_val_ranges": "80 to 230 ng/dL",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "2",
    "profile_group_cd": "BIO0097",
    "profile_name": "Thyroid Profile",
    "profile_name_desc": "Thyroid Profile Total is a group of tests that are done together to detect or diagnose thyroid diseases. It measures the levels of the following three hormones in the blood: Thyroid Stimulating Hormone (TSH), Thyroxine (T4) - Total and TriIodothyronine (T3) - Total.",
    "group_display_order": 2,
    "param_display_order": 2,
    "paramcd": "LPR88",
    "param_name": "T4",
    "param_short_name": "T4",
    "normal_min_val": "3.2",
    "normal_max_val": "12.6",
    "normal_val_ranges": "3.2 - 12.6  ug/dl",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "2",
    "profile_group_cd": "BIO0097",
    "profile_name": "Thyroid Profile",
    "profile_name_desc": "Thyroid Profile Total is a group of tests that are done together to detect or diagnose thyroid diseases. It measures the levels of the following three hormones in the blood: Thyroid Stimulating Hormone (TSH), Thyroxine (T4) - Total and TriIodothyronine (T3) - Total.",
    "group_display_order": 2,
    "param_display_order": 3,
    "paramcd": "LPR89",
    "param_name": "TSH",
    "param_short_name": "TSH",
    "normal_min_val": "0.55",
    "normal_max_val": "4.78",
    "normal_val_ranges": "0.55 - 4.78  uIU/ml",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "3",
    "profile_group_cd": "BIO283",
    "profile_name": "Renal Function Test",
    "profile_name_desc": "A test in which blood or urine samples are checked for the amounts of certain substances released by the kidneys. A higher- or lower-than-normal amount of a substance can be a sign that the kidneys are not working the way they should. Also called kidney function test.",
    "group_display_order": 3,
    "param_display_order": 1,
    "paramcd": "LPR774",
    "param_name": "BLOOD UREA",
    "param_short_name": "BLOOD UREA",
    "normal_min_val": "15.0",
    "normal_max_val": "39",
    "normal_val_ranges": "15.0 - 39  mg/dL",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "3",
    "profile_group_cd": "BIO283",
    "profile_name": "Renal Function Test",
    "profile_name_desc": "A test in which blood or urine samples are checked for the amounts of certain substances released by the kidneys. A higher- or lower-than-normal amount of a substance can be a sign that the kidneys are not working the way they should. Also called kidney function test.",
    "group_display_order": 3,
    "param_display_order": 2,
    "paramcd": "LPR1450",
    "param_name": "SERUM CREATININE",
    "param_short_name": "SERUM CREATININE",
    "normal_min_val": "0.6",
    "normal_max_val": "1.3",
    "normal_val_ranges": "0.6 - 1.3  mg/dL",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "3",
    "profile_group_cd": "BIO283",
    "profile_name": "Renal Function Test",
    "profile_name_desc": "A test in which blood or urine samples are checked for the amounts of certain substances released by the kidneys. A higher- or lower-than-normal amount of a substance can be a sign that the kidneys are not working the way they should. Also called kidney function test.",
    "group_display_order": 3,
    "param_display_order": 3,
    "paramcd": "LPR989",
    "param_name": "SERUM SODIUM",
    "param_short_name": "SERUM SODIUM",
    "normal_min_val": "135",
    "normal_max_val": "145",
    "normal_val_ranges": "135 - 145  mmol/L",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "3",
    "profile_group_cd": "BIO283",
    "profile_name": "Renal Function Test",
    "profile_name_desc": "A test in which blood or urine samples are checked for the amounts of certain substances released by the kidneys. A higher- or lower-than-normal amount of a substance can be a sign that the kidneys are not working the way they should. Also called kidney function test.",
    "group_display_order": 3,
    "param_display_order": 4,
    "paramcd": "LPR990",
    "param_name": "SERUM POTASSIUM",
    "param_short_name": "SERUM POTASSIUM",
    "normal_min_val": "3.5",
    "normal_max_val": "5.1",
    "normal_val_ranges": "3.5 - 5.1  mmol/L",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "3",
    "profile_group_cd": "BIO283",
    "profile_name": "Renal Function Test",
    "profile_name_desc": "A test in which blood or urine samples are checked for the amounts of certain substances released by the kidneys. A higher- or lower-than-normal amount of a substance can be a sign that the kidneys are not working the way they should. Also called kidney function test.",
    "group_display_order": 3,
    "param_display_order": 5,
    "paramcd": "LPR991",
    "param_name": "SERUM CHLORIDE",
    "param_short_name": "SERUM CHLORIDE",
    "normal_min_val": "98",
    "normal_max_val": "107",
    "normal_val_ranges": "98 - 107  mmol/L",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "4",
    "profile_group_cd": "BIO0119",
    "profile_name": "Liver Function Test With Proteins",
    "profile_name_desc": "A hemoglobin A1c (HbA1c) test measures the amount of blood sugar (glucose) attached to hemoglobin. Hemoglobin is the part of your red blood cells that carries oxygen from your lungs to the rest of your body",
    "group_display_order": 4,
    "param_display_order": 1,
    "paramcd": "LPR47",
    "param_name": "TOTAL BILIRUBIN",
    "param_short_name": "TOTAL BILIRUBIN",
    "normal_min_val": "0.2",
    "normal_max_val": "1.0",
    "normal_val_ranges": "0.2 - 1.0  mg/dL",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "4",
    "profile_group_cd": "BIO0119",
    "profile_name": "Liver Function Test With Proteins",
    "profile_name_desc": "A hemoglobin A1c (HbA1c) test measures the amount of blood sugar (glucose) attached to hemoglobin. Hemoglobin is the part of your red blood cells that carries oxygen from your lungs to the rest of your body",
    "group_display_order": 4,
    "param_display_order": 2,
    "paramcd": "LPR48",
    "param_name": "CONJUGATED BILIRUBIN",
    "param_short_name": "CONJUGATED BILIRUBIN",
    "normal_min_val": "0.0",
    "normal_max_val": "0.2",
    "normal_val_ranges": "0.0 - 0.2  mg/dL",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "4",
    "profile_group_cd": "BIO0119",
    "profile_name": "Liver Function Test With Proteins",
    "profile_name_desc": "A hemoglobin A1c (HbA1c) test measures the amount of blood sugar (glucose) attached to hemoglobin. Hemoglobin is the part of your red blood cells that carries oxygen from your lungs to the rest of your body",
    "group_display_order": 4,
    "param_display_order": 3,
    "paramcd": "LPR49",
    "param_name": "UNCONJUGATED BILIRUBIN",
    "param_short_name": "UNCONJUGATED BILIRUBIN",
    "normal_min_val": "0.19",
    "normal_max_val": "1.0",
    "normal_val_ranges": "0.19 - 1.0  mmol/L",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "4",
    "profile_group_cd": "BIO0119",
    "profile_name": "Liver Function Test With Proteins",
    "profile_name_desc": "A hemoglobin A1c (HbA1c) test measures the amount of blood sugar (glucose) attached to hemoglobin. Hemoglobin is the part of your red blood cells that carries oxygen from your lungs to the rest of your body",
    "group_display_order": 4,
    "param_display_order": 4,
    "paramcd": "LPR50",
    "param_name": "ALP",
    "param_short_name": "ALP",
    "normal_min_val": "46",
    "normal_max_val": "116",
    "normal_val_ranges": "46 - 116  mmol/L",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "4",
    "profile_group_cd": "BIO0119",
    "profile_name": "Liver Function Test With Proteins",
    "profile_name_desc": "A hemoglobin A1c (HbA1c) test measures the amount of blood sugar (glucose) attached to hemoglobin. Hemoglobin is the part of your red blood cells that carries oxygen from your lungs to the rest of your body",
    "group_display_order": 4,
    "param_display_order": 5,
    "paramcd": "LPR51",
    "param_name": "ALT (SGPT)",
    "param_short_name": "ALT (SGPT)",
    "normal_min_val": "16",
    "normal_max_val": "63",
    "normal_val_ranges": "16 - 63  U/L",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 1,
    "paramcd": "LPR13",
    "param_name": "COLOUR",
    "param_short_name": "COLOUR",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 2,
    "paramcd": "LPR14",
    "param_name": "APPEARANCE",
    "param_short_name": "APPEARANCE",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 3,
    "paramcd": "LPR16",
    "param_name": "SPECIFIC GRAVITY",
    "param_short_name": "SPECIFIC GRAVITY",
    "normal_min_val": 1.005,
    "normal_max_val": 1.035,
    "normal_val_ranges": "1.005 - 1.035",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 4,
    "paramcd": "LPR1656",
    "param_name": "PH",
    "param_short_name": "PH",
    "normal_min_val": 4.5,
    "normal_max_val": 7.5,
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 5,
    "paramcd": "LPR18",
    "param_name": "GLUCOSE",
    "param_short_name": "GLUCOSE",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 6,
    "paramcd": "LPR17",
    "param_name": "PROTEIN",
    "param_short_name": "PROTEIN",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 7,
    "paramcd": "LPR19",
    "param_name": "BILE SALTS",
    "param_short_name": "BILE SALTS",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 8,
    "paramcd": "LPR20",
    "param_name": "BILE PIGMENTS",
    "param_short_name": "BILE PIGMENTS",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 9,
    "paramcd": "LPR21",
    "param_name": "KETONE BODIES",
    "param_short_name": "KETONE BODIES",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 10,
    "paramcd": "LPR22",
    "param_name": "UROBILINOGEN",
    "param_short_name": "UROBILINOGEN",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 11,
    "paramcd": "LPR23",
    "param_name": "BLOOD",
    "param_short_name": "BLOOD",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 12,
    "paramcd": "LPR25",
    "param_name": "PUS CELLS",
    "param_short_name": "PUS CELLS",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 13,
    "paramcd": "LPR24",
    "param_name": "EPITHELIAL CELLS",
    "param_short_name": "EPITHELIAL CELLS",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 14,
    "paramcd": "LPR26",
    "param_name": "R.B.C.",
    "param_short_name": "R.B.C.",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 15,
    "paramcd": "LPR27",
    "param_name": "CASTS",
    "param_short_name": "CASTS",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 16,
    "paramcd": "LPR28",
    "param_name": "CRYSTALS",
    "param_short_name": "CRYSTALS",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "PAT0041",
    "profile_name": "Urine Routine & Microscopy Extended",
    "profile_name_desc": "",
    "group_display_order": 5,
    "param_display_order": 17,
    "paramcd": "LPR112",
    "param_name": "NOTE",
    "param_short_name": "NOTE",
    "normal_min_val": "",
    "normal_max_val": "",
    "normal_val_ranges": null,
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "6",
    "profile_group_cd": "BIO0176",
    "profile_name": "TOTAL IRON BINDING CAPACITY (TIBC)",
    "profile_name_desc": "",
    "group_display_order": 6,
    "param_display_order": 1,
    "paramcd": "LPR67",
    "param_name": "TIBC",
    "param_short_name": "TIBC",
    "normal_min_val": 250,
    "normal_max_val": 450,
    "normal_val_ranges": "250 - 450  ug/dL",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "6",
    "profile_group_cd": "BIO0176",
    "profile_name": "TOTAL IRON BINDING CAPACITY (TIBC)",
    "profile_name_desc": "",
    "group_display_order": 6,
    "param_display_order": 2,
    "paramcd": "LPR549",
    "param_name": "% SATURATION",
    "param_short_name": "% SATURATION",
    "normal_min_val": 20,
    "normal_max_val": 50,
    "normal_val_ranges": "20 - 50  %",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "7",
    "profile_group_cd": "BIO0013",
    "profile_name": "GLYCATED HAEMOGLOBIN (HBA1C)",
    "profile_name_desc": "",
    "group_display_order": 7,
    "param_display_order": 1,
    "paramcd": "LPR219",
    "param_name": "HBA1C",
    "param_short_name": "HBA1C",
    "normal_min_val": 0.1,
    "normal_max_val": 8.0,
    "normal_val_ranges": " Non Diabetic :  4.27 - 6.07  %\r  Diabetic- Goal:< 7.0 %\r Action Suggested:> 8.0 %",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "BIO0013",
    "profile_name": "GLYCATED HAEMOGLOBIN (HBA1C)",
    "profile_name_desc": "",
    "group_display_order": 7,
    "param_display_order": 2,
    "paramcd": "LPR1671",
    "param_name": "IFCC",
    "param_short_name": "IFCC",
    "normal_min_val": 23.2,
    "normal_max_val": 43,
    "normal_val_ranges": "23.2-43.0 mmol/mol",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  },
  {
    "plg_id": "5",
    "profile_group_cd": "BIO0013",
    "profile_name": "GLYCATED HAEMOGLOBIN (HBA1C)",
    "profile_name_desc": "",
    "group_display_order": 7,
    "param_display_order": 3,
    "paramcd": "LPR1672",
    "param_name": "EAG",
    "param_short_name": "EAG",
    "normal_min_val": 76,
    "normal_max_val": 128,
    "normal_val_ranges": "76 - 128  mg/dL",
    "normal_val_indication": null,
    "normal_val_recommandation": null,
    "lower_critical_val": "NULL",
    "lower_critical_indication": null,
    "lower_critical_recommandation": null,
    "upper_critical_val": "NULL",
    "upper_critical_indication": null,
    "upper_critical_recommandation": null
  }
];

var allowedParameters = [

    {
        "PARAMETERCD": "LPR1",
        "PARAMETERDESC": "HAEMOGLOBIN",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 1,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR4",
        "PARAMETERDESC": "WBC COUNT",
        "SERVICEGROUPCD": "PAT",
        "SERVICEGROUPNAME": "PATHOLOGY",
        "ORDER": 2,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR5",
        "PARAMETERDESC": "PLATELET COUNT",
        "SERVICEGROUPCD": "PAT",
        "SERVICEGROUPNAME": "PATHOLOGY",
        "ORDER": 3,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR989",
        "PARAMETERDESC": "SERUM SODIUM",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 4,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR990",
        "PARAMETERDESC": "SERUM POTASSIUM",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 5,
        "ENABLED": "true"

    },
    {
        "PARAMETERCD": "LPR991",
        "PARAMETERDESC": "SERUM CHLORIDE",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 6,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR1450",
        "PARAMETERDESC": "SERUM CREATININE",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 7,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR774",
        "PARAMETERDESC": "BLOOD UREA",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 8,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR61",
        "PARAMETERDESC": "SERUM URIC ACID",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 9,
        "ENABLED": "true"

    },
    {
        "PARAMETERCD": "LPR59",
        "PARAMETERDESC": "SERUM CALCIUM",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 10,
        "ENABLED": "true"

    },
    {
        "PARAMETERCD": "LPR62",
        "PARAMETERDESC": "SERUM MAGNESIUM",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 11,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR35",
        "PARAMETERDESC": "RANDOM BLOOD SUGAR",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 12,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR37",
        "PARAMETERDESC": "FASTING BLOOD GLUCOSE",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 13,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR39",
        "PARAMETERDESC": "POST PRANDIAL BLOOD GLUCOSE",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 14,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR219",
        "PARAMETERDESC": "HBA1C",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 15,
        "ENABLED": "true"
    },

    {
        "PARAMETERCD": "LPR1835",
        "PARAMETERDESC": "D-DIMER",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 16,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR65",
        "PARAMETERDESC": "LDH",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 17,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR1838",
        "PARAMETERDESC": "CRP QUANTITATIVE",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 18,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR1839",
        "PARAMETERDESC": "CRP-PENTRA",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 19,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR68",
        "PARAMETERDESC": "FERRITIN",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 20,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR1819",
        "PARAMETERDESC": "IL-6 (INTERLEUKIN)",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 21,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR994",
        "PARAMETERDESC": "SERUM TROP-T HS",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 22,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR47",
        "PARAMETERDESC": "TOTAL BILIRUBIN",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 23,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR52",
        "PARAMETERDESC": "AST (SGOT)",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 24,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR51",
        "PARAMETERDESC": "ALT (SGPT)",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 25,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR1241",
        "PARAMETERDESC": "GGT",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 26,
        "ENABLED": "true"

    },
    {
        "PARAMETERCD": "LPR53",
        "PARAMETERDESC": "TOTAL PROTEIN",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 27,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR54",
        "PARAMETERDESC": "SERUM ALBUMIN",
        "SERVICEGROUPCD": "BIO",
        "SERVICEGROUPNAME": "BIOCHEMISTRY",
        "ORDER": 28,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR41",
        "PARAMETERDESC": "TOTAL CHOLESTEROL (TOTAL)",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 29,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR44",
        "PARAMETERDESC": "SERUM LDL DIRECT",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 30,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR43",
        "PARAMETERDESC": "SERUM HDL DIRECT",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 31,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR42",
        "PARAMETERDESC": "TRIGLYCERIDES",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 32,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR89",
        "PARAMETERDESC": "SERUM TSH",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 33,
        "ENABLED": "true"
    },
    {
        "PARAMETERCD": "LPR468",
        "PARAMETERDESC": "SERUM PSA (TOTAL)",
        "SERVICEGROUPCD": "",
        "SERVICEGROUPNAME": "",
        "ORDER": 34,
        "ENABLED": "true"
    },
];


var val = [];
/*Preparing Main Data(Group) */
function prepareJson(hisLabResult, emrLabResult,billNo) {
	//console.log("prepareJson",hisLabResult)
	emrLabResult = emrLabResults_new;
    var existsGroups = [];
    var remainsGroups = [];
    //var billNo = 'BIL17-035826';
    //var billNo = 'IP20-001688';
	//var billNo = 'BIL21-034306';
	//console.log("billNo",billNo )
		//console.log("his-rpt",hisLabResult )
			
    var billWiseData = _.filter(hisLabResult, function (_obj) { return _obj.BILLNO === billNo; });
	
	//console.log("smart-rpt",billWiseData )

    let finalData = [];
    for (let i in allowedParameters) {
        result = billWiseData.filter(e => e.PARAMETERCD == allowedParameters[i].PARAMETERCD);
        finalData = finalData.concat(result);
    }
    //console.log("labOrgLevelParams(req.body.ID)",finalData)

    val = JSON.parse(JSON.stringify(finalData).replace(/\:null/gi, "\:\"\""));

    _.each(val, function (_obj, idx) {
        var _spiltValues = _obj.NORMALVALUES ? _obj.NORMALVALUES.split(_obj.RESULTUOM)[0].split('-') : "";

        // if (_obj.PARAMETERCD == 'LPR48')
        //     alert(_obj.PARAMETERCD);

        _obj["minValue"] = (_spiltValues && _spiltValues[0]) ? (parseFloat(_spiltValues[0].replace(/[^0-9\.]+/g, ''))) : 0;
        _obj["maxValue"] = (_spiltValues && _spiltValues[1]) ? parseFloat(_spiltValues[1].replace(/[^0-9\.]+/g, '')) : 0;

        var _value = _obj.RESULTVALUESB.length == 0 ? _obj.RESULTS.replace(/[^\d.-]/g, '') : _obj.RESULTS;
        _obj["userValue"] = _value.includes('.') ? (isNaN(parseFloat(_value)) ? _value : parseFloat(_value)) : isNaN(parseInt(_value)) ? _value : parseInt(_value);
        _obj["showTrending"] = isNaN(_obj["userValue"]) ? false : true;

        _obj["_epochDate"] = parseInt(_obj.BILLED_DT.replace('/', '').split('(')[1].split(')')[0]);
        _obj["billDate"] = moment(_obj["_epochDate"]).format('DD-MMM-YYYY');

        if (_obj.DEVIATETYPE === 'UPPER ABNORMAL') {
            getUpperValue(_obj);
        }
        else if (_obj.DEVIATETYPE === 'LOWER ABNORMAL') {
            getLowerValue(_obj);
        }
        else {
            getNormalValue(_obj);
        }
    });

    var hisGroupsList = _.groupBy(val, 'SERVICE_CODE');
    var emrGroupsList = _.groupBy(emrLabResult, 'profile_group_cd');


    _.each(emrGroupsList, function (eItem, eIdx) {
        _.each(hisGroupsList, function (hItem, hIdx) {
            if (eIdx == hIdx) {
                var hisParams = _.groupBy(hItem, 'PARAMETERCD');
                var emrParams = _.groupBy(eItem, 'paramcd');
                var output = [];
                var grpIndication = eItem[0].profile_indication || _dummyText;
                var grpRecommandation = eItem[0].profile_recommandation || _dummyText;
                output.push({
                    "type": "GROUP",
                    "groupName": eItem[0].profile_name,
                    "description": eItem[0].profile_name_desc,
                    "indication": grpIndication,
                    "recommandation": grpRecommandation,
                    "showGroupIndicationRecomandation": (grpIndication != null || grpRecommandation != null) ? true : false,
                    "childrens": prepareChild(hItem, eItem, hisLabResult)
                });
                existsGroups.push(output);
            }
            else {
                var remainingGroups = [];
                // remainingGroups.push({
                //   "type": "GROUP",
                //   "groupName": hItem[0].LABEQUINAME,
                //   "description": hItem[0].LABEQUINAME || null,
                //   "indication": null,
                //   "recommandation": null,
                //   "showGroupIndicationRecomandation": false,
                //   "childrens": prepareChild(hItem, eItem)
                // });
                // existsGroups.push(remainingGroups);
            }
        });
    });
    return existsGroups;
}

/*This is child of Preparing Main Data(Group) */
function prepareChild(hObj, eObj,_mainData) {
    var childs = [];
    _.each(hObj, function (item) {
        var eItem = _.filter(eObj, function (_obj) { return _obj.paramcd == item.PARAMETERCD; });
        // if (item.PARAMETERCD == 'LPR44')
        //     alert(item.PARAMETERCD);
        //if (eItem && eItem.length > 0) {
        var _graphData = (item.showTrending && !isNaN(item.RESULTS)) ? getHistoricalData(item, _mainData) : [];
       // var _indication = eItem[0] ? (item.DEVIATETYPE === 'UPPER ABNORMAL') ? eItem[0].upper_critical_indication : ((item.DEVIATETYPE === 'LOWER ABNORMAL') ? eItem[0].lower_critical_indication : eItem[0].normal_val_indication) : _dummyText;
        //var _recomandation = eItem[0] ? (item.DEVIATETYPE === 'UPPER ABNORMAL') ? eItem[0].upper_critical_recommandation : ((item.DEVIATETYPE === 'LOWER ABNORMAL') ? eItem[0].lower_critical_recommandation : eItem[0].normal_val_recommandation) : _dummyText;
		var _indication = _dummyText;
		var _recomandation = _dummyText;
	   var subChild = [];
        subChild.push({
            "parameterName": eItem[0] ? eItem[0].param_name : (item.PARAMETERDESC || null),
            "parameterDescription": _dummyText,
            "parameterStatus": item.DEVIATETYPE,
            "userResultValue": item.userValue || 0,
            "units": item.RESULTUOM,
            "billDate": item.billDate,
            "_epochDate": item._epochDate,
            "startPoint": item.startingPoint,
            "endPoint": item.endingPoint,
            "lowerContainerWidth": item.startingContainerWidth,
            "normalContainerWidth": item.normalContainerWidth,
            "upperContainerWidth": item.normalAboveContainerWidth,
            "userIndicationWidth": item.userIndicatorContainerWidth,
            "minValue": (eItem[0] ? eItem[0].normal_min_val : (item.minValue || null)),
            "maxValue": (eItem[0] ? eItem[0].normal_max_val : (item.maxValue || null)),
            "showIndication": item.showTrending,
            "indication": _indication,
            "recommandations": _recomandation,
            "parameterResultBgColor": (item.DEVIATETYPE === 'UPPER ABNORMAL') ? "#ec4444" : ((item.DEVIATETYPE === 'LOWER ABNORMAL') ? "#8b65ff" : "#7ee671"),
            "showParameterIndicationRecomandation": (_indication != null || _recomandation != null) ? true : false,
            "historicalGraphData": item.showTrending ? _graphData : [],
            "_SVG_DATA_": (item.showTrending && _graphData.length > 0) ? prepareD3Graph(_graphData) : ""
        })
        childs.push(subChild);
        // }
    });

    return childs;

};

/* Supporting Functions  */

function getUpperValue(val, idx, multiplier) {
    var _upperDelta = val.userValue - val.maxValue;
    var _bool = false;
    val["endingPoint"] = parseFloat(parseFloat(val.maxValue + (_upperDelta * (multiplier || 2))).toFixed(2));

    val["startingPoint"] = parseFloat(parseFloat(val.minValue - (_upperDelta)).toFixed(2));
    var _type = val["startingPoint"] < 0 ? "MIN_TO_MAX" : "MAX_TO_MIN";
    val["startingContainerWidth"] = parseFloat(parseFloat(percentageCalculator(val.minValue, val["startingPoint"], val["endingPoint"], _type)).toFixed(2));
    val["normalContainerWidth"] = parseFloat(parseFloat(percentageCalculator(val.maxValue, val["startingPoint"], val["endingPoint"], _type) - val["startingContainerWidth"]).toFixed(2));
    val["normalAboveContainerWidth"] = 100 - (val["startingContainerWidth"] + val["normalContainerWidth"]);
    val["userIndicatorContainerWidth"] = parseFloat(parseFloat(percentageCalculator(val.userValue, val["startingPoint"], val["endingPoint"])).toFixed(2));
    if (val["normalContainerWidth"] < val["normalAboveContainerWidth"] && !val["_bool"]) {
        val["_bool"] = true;
        getUpperValue(val, 0, 1.12);
        return val;
    }
    else
        return val;
};

function getLowerValue(val, idx) {
    var _lowerDelta = val.minValue - val.userValue;
    val["endingPoint"] = parseFloat(parseFloat(val.maxValue + _lowerDelta).toFixed(2));
    val["startingPoint"] = parseFloat(parseFloat(val.minValue - (_lowerDelta * 2)).toFixed(2));
    var _type = val["startingPoint"] < 0 ? "MIN_TO_MAX" : "MAX_TO_MIN";
    val["startingContainerWidth"] = parseFloat(parseFloat(percentageCalculator(val.minValue, val["startingPoint"], val["endingPoint"], _type)).toFixed(2));
    val["normalContainerWidth"] = parseFloat(parseFloat(percentageCalculator(val.maxValue, val["startingPoint"], val["endingPoint"], _type) - val["startingContainerWidth"]).toFixed(2));
    val["normalAboveContainerWidth"] = 100 - (val["startingContainerWidth"] + val["normalContainerWidth"]);
    val["userIndicatorContainerWidth"] = parseFloat(parseFloat(percentageCalculator(val.userValue, val["startingPoint"], val["endingPoint"])).toFixed(2));
    return val;

};
function getNormalValue(val, idx) {
    var _normal = parseFloat(parseFloat(((10 * val.maxValue) / 100)).toFixed(2));
    val["endingPoint"] = parseFloat(parseFloat(val.maxValue + _normal).toFixed(2));
    var _statPoint = parseFloat(parseFloat(val.minValue - _normal).toFixed(2));
    val["startingPoint"] = _statPoint < 0 ? 0 : _statPoint;
    val["startingContainerWidth"] = 10;
    val["normalContainerWidth"] = 80;
    val["normalAboveContainerWidth"] = 100 - (val["startingContainerWidth"] + val["normalContainerWidth"]);
    val["userIndicatorContainerWidth"] = val.maxValue ? parseFloat(parseFloat(percentageCalculator(val.userValue, val["startingPoint"], val["endingPoint"])).toFixed(2)) : 0;
    return val;
};


function percentageCalculator(input, minVal, maxVal, type) {
    var _result = 0;
    if (type && type == "MIN_TO_MAX")
        _result = ((minVal - input) * 100) / (minVal - maxVal);
    else
        _result = ((input - minVal) * 100) / (maxVal - minVal)
    return _result;
}

function getHistoricalData(_child,_val) {
    var groupData = _.filter(_val, function (_obj) { return _obj.PARAMETERCD === _child.PARAMETERCD; });
    _.each(groupData, function (item) {
        item._epochDate = parseInt(item.BILLED_DT.replace('/', '').split('(')[1].split(')')[0]);
    });
    var _parameterData = [];
    groupData = _.sortBy(groupData, function (eitem) {
        return -eitem._epochDate;
    })
    _parameterData = _.chain(groupData).groupBy("_epochDate").map(function (pitem, pkey) {
        var parsedDate = parseInt(pkey);
        var _value = pitem[0].RESULTS.replace(/[^\d.-]/g, '');
        return {
            "date": moment(parsedDate).format('YYYY-MM-DD'),
            "Value": !isNaN(_value) ? (_value.includes('.') ? parseFloat(_value) : parseInt(_value)) : 0
        }
    }).value();
    return _parameterData;
    //console.log("parame", _parameterData);
}



/*Preparing Graph */
function prepareD3Graph(dataInput) {

    var d3n = new D3Node();
    var d3 = d3n.d3;

    var maxNum = 2;

    var margin = { top: 5, right: 5, bottom: 30, left: 25 },
        width = 230 - margin.left - margin.right,
        height = 115 - margin.top - margin.bottom;

    var svg = d3n.createSVG()
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    //dataInput.push({ "date": "2012-08-09", "Value": 10 });
    var data = dataInput;



    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) {
            return moment(d.date).format("MMM YY");
        }))
        .padding(1);

    svg.append("g")
        .attr("class", "axisRed")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("font-size", "6px")
        .style("text-anchor", "end")
        .attr("fill", "#949494");

    var data1 = data.map(function (d) { return d.Value; });

    for (i = 0; i <= maxNum; i++) {
        if (data1[i] > maxNum) {
            var maxNum = data1[i];
        }
    }

    var y = d3.scaleLinear()
        .domain([0, maxNum])
        .range([height, 0]);

    var yAxis = d3.axisLeft(y).ticks(2);

    svg.append("g")
        .style("font-size", "6px")
        .attr("class", "axisRed")
        .call(yAxis);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#06315A")
        .attr("stroke-width", 1)
        .attr("d", d3.line()
            .x(function (d) { return x(moment(d.date).format("MMM YY")) })
            .y(function (d) { return y(d.Value) })
        )

    svg.append("g")
        .selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(moment(d.date).format("MMM YY")); })
        .attr("cy", function (d) { return y(d.Value); })
        .attr("r", "3.5")
        .style("fill", function (d) {

            if (d.Value < 6) {
                return "#7ee671";
            } else if (d.Value < 40 && d.Value >= 20) {
                return "#8b65ff";
            }
            else {
                return "#ec4444";
            }

        });

    svg.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .style("font-size", "6px")
        .style("font-family", "arial")
        .attr("dy", "0.35em")
        .attr("x", function (d) { return x(moment(d.date).format("MMM YY")) + 5; })
        .attr("y", function (d) { return y(d.Value); })
        .text(d => d.Value);


    return d3n.svgString();


}






/*Rending Html  */
function renderHtml(_hisData, _preparedData) {
    var __html = fs.readFileSync(path.join(__dirname, 'clients', `/smart-report-aayush.htm`), "utf8");

	var _epochBillDate = parseInt(_hisData[0].BILLED_DT.replace('/', '').split('(')[1].split(')')[0]);
	var billDate = moment(_epochBillDate).format('DD-MMM-YYYY / HH:mm');
	var _epochReportDate = parseInt(_hisData[0].REPORTDT.replace('/', '').split('(')[1].split(')')[0]);
	var __reportDate = moment(_epochReportDate).format('DD-MMM-YYYY');
	var reportDate = moment(_epochReportDate).format('DD-MMM-YYYY / HH:mm');

	
	var template = UnderscoreTemplate(__html);

	//console.log("html---",prepareJson(_hisData, _emrData, billNo))
    var output = template({
			"patientName": _hisData[0].PATIENTNAME || null,
			"doctorName": _hisData[0].CONSULTANT_DOCTOR || null,
			"billNo": _hisData[0].BILLNO || null,
			"registeredDate": billDate || null,
			"collectionDate": __reportDate|| null,
			"reportDate": reportDate || null,
			"data": _preparedData
    });
    return output;
}

/*Generate PDF */
function generatePagePdf(_hisData, _preparedData) {
    //console.time("ExeTime");
    //var __html = fs.readFileSync(path.join(__dirname, 'public', `/template.htm`), "utf8");
   // var fileName = `babu.pdf`;
   var _umrNo = _hisData[0].UMRNO;
	var fileName = `${_umrNo}_${moment(new Date()).valueOf()}.pdf`;

    var options = {
        format: "A4",
        orientation: "portrait",
        header: {
            height: "32mm",
            contents: `
           
                    <div>
                        <div style="height: 10px; background-color:#06315A ;width: 100%;">&nbsp;</div>
                        <div style="height: 55px; width: 100%;">
                            <div style="margin-left:30px;float:left;">
                            <img src="http://www.aayushhospitals.com/images/logo.jpg" style="width: 85px;height: 51px;" />
                            </div>
                            <div style="margin-right:30px;float:right;padding-top:20px;text-align: right;">
                                <div style="font-size: 7px;">Created Date</div>
                                <div style="font-size: 7px;">05-Jul-2021</div>
                            </div>
                            <div style="clear: both;"></div>
                        </div>
                        <div style="clear: both;"></div>
                        <div style="font-size: 12px;color: gray;text-align:left;padding-bottom:10px;float:left;"><b style="padding-left:30px;">Test Report</b></div>
                        <div style="clear: both;"></div>
                        <div style="font-size: 1px;background-color: lightgrey;width: 100%;height: 1px; line-height: 0px;float:left;"></div>
                        <div style="clear: both;"></div>
                    </div>
               
            `
        },
        footer: {
            height: "15mm",
            contents: {
                default: `<div>
                            <div style="font-size: 1px;background-color: lightgrey;margin-bottom:5px;width: 100%;height: 1px; line-height: 0px;float:left;"></div>
                            <div style="clear: both;"></div>
                            <div style="float:left;margin-left:30px; padding:3px; ">
                                <div style="color: #06315A; margin-bottom: 2px;font-size:7px;">CENTER OPENING HOURS</div>
                                <div>
                                    <div style="width:10%; float:left;font-size:6px;color: #4a4a4a;"> Mon </div>
                                    <div style="width:90%; float:left;font-size:6px;color: #4a4a4a;"> : 07:00 AM-10:00 PM </div>
                                </div>
                                <div>
                                    <div style="width:10%; float:left;font-size:6px;color: #4a4a4a;"> Sun </div>
                                    <div style="width:90%; float:left;font-size:6px;color: #4a4a4a;"> : 07:00 AM-05:00 PM </div>
                                </div>
                            </div>
                            <div style="float:left;margin-left:250px; padding:3px;"> {{page}} / {{pages}} </div>
                            <div style="float:right;margin-right:30px; padding:3px;">
                                <div style="color: #06315A; margin-bottom: 2px;font-size:7px;">CONTACT US</div>
                                <div>
                                    <div style="font-size:6px;color: #4a4a4a; text-decoration: none;">+91 86880 86880.</div>
                                    <div style="font-size:6px;color: #4a4a4a; text-decoration: none;">info@tenetmedcorp.com</div>
                                </div>
                            </div>
                            <div style="clear: both;"></div>
                          </div>`
            }
        }
    };

    var document = {
        // html: "<div style='display:none'><img src='https://www.kimshospitals.com/_nuxt/img/kims_logo.63a8855.png'/></div>"+html.replace('<HTML_CONTENT>',req.body.graph_data).replace('<CLIENT>',req.body.client_name),
        html: renderHtml(_hisData,_preparedData),
        data: {},
        path: `D://hosting/prod/emrOp/UI/downloadpdf/${fileName}`,
        type: "",
    };
	


    // console.timeEnd("ExeTime");
    // console.time("Pdf-ExeTime");

    return new Promise(function (resolve, reject) {
        pdf.create(document, options).then((output) => {
			var _path = `/downloadpdf/${fileName}`;
            //console.log('file_name', _path);
            //console.timeEnd("Pdf-ExeTime");
            resolve(_path);
        })
            .catch((error) => {
                reject(error);
               // console.error(error);
                // return res.send({ 'Error': error });
            });
    });




    // return mapper.scalar(dbSchema.signin, req.body, res);

}

module.exports = {
	generatePagePdf: (_hisData, _preparedData) => {
        return generatePagePdf(_hisData, _preparedData);

    },
    prepareJson: (_hisData,emrLabResult, billNo) => {
        return prepareJson(_hisData,emrLabResult, billNo);
    }
	
};

