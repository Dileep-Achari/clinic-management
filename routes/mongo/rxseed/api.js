const express = require('express');
const router = express.Router();
const fs = require('fs');
const Jimp = require("jimp");
const path = require('path');
const _ = require("underscore");
const multer  = require('multer');
const upload = multer();
const cpUpload =upload.fields([{name:"file",maxcount:1}])
const _basePath = "/var/www/html/doc9/node/api_v1/routes/mongo/rxseed/images"


function functionName(final,reqBody){
    let finalObjData = {
        "status":"",
        "statusmessage":"",
        "data":[]
    }
    let king = []
     _.filter(final,function(data,indx){
                    king = Object.keys(data).filter((key) => key.includes(reqBody.field))
                    if(king && king.length > 0){
                        if(king[0] === reqBody.field &&  data[`${reqBody.field}`] === reqBody.value){
                            finalObjData.status =200,
                            finalObjData.statusmessage="success",
                            finalObjData["data"].push(data)
                          }
                          else{
                            finalObjData.status =400,
                            finalObjData.statusmessage="fail",
                            finalObjData.data="no data found"
                        }
                        }
                        else{
                            finalObjData.status =400,
                            finalObjData.statusmessage="fail",
                            finalObjData.data="no field found"
                            }
                        })
                return finalObjData
}

async function readDirectories(dir) {
    try {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, async (error, fileNames) => {
                if (error) {
                    resolve({
                        success: false,
                        desc: error,
                        data: []
                    })
                }
                else {
                    resolve({
                        success: true,
                        data: fileNames
                    })
                }
            });
        });
    }
    catch (err) {
        return {
            success: false,
            desc: err.message,
            data: []
        }
    }
}


async function getFolderData2(pathName, paths) {
    let dirName;
    let url;
    if (pathName) {
        dirName = _basePath + pathName;
        url = `https://monogoapi.doctor9.com/images${pathName}/`
    }
    else {
        dirName = _basePath;
        url = `https://monogoapi.doctor9.com/images/`
    }
    let _filesData = [];
    let _files = await readDirectories(dirName);
    if (!_files.success || _files.data.length == 0) {
        return _filesData;
    }
    else {
        _files.data.forEach(filename => {
            let _fObj = {
                "type": "FILE",
                "fileName": "",
                "path": "",
                "ext": ""
            }
            let filepath = path.resolve(dirName, filename);
            let stat = fs.lstatSync(filepath);
            let name = path.parse(filename).name;
            let ext = path.parse(filename).ext;
            if (stat && stat.isFile()) {
                _fObj.type = "FILE";
                _fObj.fileName = name;
                _fObj.path = `${url}${filename}`;
                _fObj.ext = ext;
                _filesData.push(_fObj);
            }
            else {
                _fObj.type = "FOLDER";
                _fObj.fileName = filename;
                _filesData.push(_fObj);
            }
        })
        return _filesData;
    }
}

router.get("/",(req,res)=>{
    res.send("api working fine")
}) 

router.post("/json/:body",async(req,res)=>{
    let splitParams=req.params.body.split("-")
     let final= fs.readdirSync(path.join(__dirname,`/jsons`)).map(fileName => {
    return fileName
    })
   let finalData =  final.filter((data,ind)=>{
        let params = data.split(".")
        return splitParams[1] === params[0]
     })

    if(finalData && finalData.length > 0){
        if(splitParams && splitParams[0] && splitParams[0] === "get"){
        let finalobj = fs.readFile(path.join(__dirname,`/jsons/${splitParams[1]}.json`),"utf8",(err,data)=>{
            return res.send({"status":200,"statusmessage":"success","data":JSON.parse(data)})
        })
        }
        else if(splitParams && splitParams[0] && splitParams[0] === "getspecific"){
            let finalObjData = []
            let finalobj = fs.readFile(path.join(__dirname,`/jsons/${splitParams[1]}.json`),"utf8",(err,data)=>{
                 let final = JSON.parse(data) 
             let funName=functionName(final,req.body)
                return res.send(funName)
                })
        }
        else if(splitParams && splitParams[0] && splitParams[0] === "insert"){
           if(req.body.json){
            let finalobj = fs.readFile(path.join(__dirname,`/jsons/${splitParams[1]}.json`),"utf8",(err,data)=>{
                let final = JSON.parse(data) 
                let inputData = final
                inputData.push(req.body.json)
                fs.writeFile(path.join(__dirname,`/jsons/${splitParams[1]}.json`),JSON.stringify(inputData),()=>{
                         return res.status(200).json({"status":200,"statusmessage":"success","data":[]}) 
                })
           
               })
           }
           else {
               return res.status(400).json(
                {
                    "status":400,
                    "statusmessage":"fail",
                    "data":"provide valid details"
                }

                )
           }
        }
        else if(splitParams && splitParams[0] && splitParams[0] === "update"){
            let findIndexs;
            let finalobj = fs.readFile(path.join(__dirname,`/jsons/${splitParams[1]}.json`),"utf8",(err,data)=>{
                let final = JSON.parse(data) 
                let hgh=functionName(final,req.body)
                if(hgh["data"] ==[] || hgh["data"]==undefined || hgh["data"] == null || hgh["data"] == 'no field found'){
                       res.json({"status":400,"statusmessage":"fail",data:"no field found"}) 
                }
                else{
                    let getData= hgh["data"].filter(filterdata=>{
                        findIndexs= final.findIndex(obj=>{return obj == filterdata})
                    });
                    if(findIndexs === undefined || findIndexs ==null){
                         return res.send("please provide valid details")
                    }else{
                        final[findIndexs]=req.body.json
                        fs.writeFile(path.join(__dirname,`/jsons/${splitParams[1]}.json`),JSON.stringify(final),()=>{
                             return res.status(200).json({message:"success",status:200,data:[]})
                        })
                    }
                }

               })
        }
        else if(splitParams && splitParams[0] && splitParams[0] === "delete"){
            let finalobj = fs.readFile(path.join(__dirname,`/jsons/${splitParams[1]}.json`),"utf8",(err,data)=>{
                 let final = JSON.parse(data)
                if(final && final.length > 0){
               let finalObjData1 ={
                "status":"",
                "statusmessage":"",
                "data":[]
               }
               _.filter(final,function(data){
               let king = Object.keys(data).filter((key) => key.includes(req.body.field))
                if(king && king.length > 0){
                    if(king[0] === req.body.field && data[`${req.body.field}`] === req.body.value){
                           delete data
                        }
                        else{
                            finalObjData1.status =200,
                            finalObjData1.statusmessage="success",
                            finalObjData1["data"].push(data) 
                        }
                      }
                    else{
                        finalObjData1.status =400,
                        finalObjData1.statusmessage="fail",
                        finalObjData1.data="no field found"
                        }
                    })
                fs.writeFile(path.join(__dirname,`/jsons/${splitParams[1]}.json`),JSON.stringify(finalObjData1.data),(err,data)=>{
                    return res.status(200).json({"status":200,"statusmessage":"success","data":[]}) 
           })  
        }
        else{
            return res.status(400).json({"status":400,"statusmessage":"fail","data":"no data found"}) 
        }
            })
        
               
            
        }
        else{
          res.send("no data found aganist parameters")  
        }  
    }
    else{
        res.send("no data found aganist parameters")
    }
})

/*image upload*/

router.post("/imageUpload", cpUpload,(req, res) => {
    try{
    let file = req.files.file[0]
    let dirName;
    if (req.body.pathName) {
        dirName = _basePath + req.body.pathName;
    }
    else {
        dirName = _basePath;
    }
    let fileName = file.originalname
     let finalData = Buffer.from(file.buffer).toString("base64");
        const data =JSON.stringify(finalData)
        const buffer = Buffer.from(data, "base64");
        Jimp.read(buffer, (err, res) => {
          if (err) throw new Error(err);
    res.write(`${dirName}/${fileName}`);
        });
        res.send({
            "status":200,
            "statusmessage":"success",
            "data":[]
        })
    }catch (error) {
        return res.status(200).send({ "status": 400, "statusmessage": "fail", "data": error })
    }
        });

/*get folders data*/
router.post("/getFolderData", async (req, res) => {
    try {
        let pathData = await getFolderData2(req.body.path);
        return res.status(200).send({ "status": 200, "statusmessage": "success", "data": pathData })
    } catch (error) {
        return res.status(200).send({ "status": 400, "statusmessage": "fail", "data": error }) 
    }
})
module.exports = router