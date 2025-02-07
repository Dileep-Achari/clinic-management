'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "GENERATEPDF";

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const CreatePdf = require("pdf-creator-node");

const header = {
   height: "100mm",
  contents: fs.readFileSync('./bhupathisir/header.html', 'utf8')
};
const footer = {
   height: "50mm",
   contents: {
   default: fs.readFileSync('./bhupathisir/footer.html', 'utf8')
  }
};
const html = fs.readFileSync('./bhupathisir/body.html', 'utf8');
app.get('/getpdf/pdfcreator', (request, response) => {

  var options = {
    height:'297mm',
    width:'210mm',
    orientation: "portrait",
    header:header,
    footer:footer
    
};

  var document = {
    html: html,
    data: {},
    path: `./${uuidv4()}-output.pdf`,
    type:  'pdf',
  };

  console.time();
  CreatePdf.create(document, options).then((res) => {
    console.log(res);
    console.timeEnd();
    response.send(`pdf created.....`)

  }).catch((error) => {
    console.error(error);
  });
})



module.exports = router;