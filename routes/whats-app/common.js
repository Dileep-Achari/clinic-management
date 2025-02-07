
const waParams=[
    {
       "type": "IMAGE",
        "params":{
         "messages":[
             {
                 "from":"",
                 "to":"",
                 "content":{
                     "templateName":"",
                     "templateData":{
                         "body":{
                             "placeholders":""
                         }
                     },
                     "language":""
                 }
             }
         ]
     }     
    },
    {
        "type": "DOCUMENT",

     },
     {
        "type": "TEXT",
        //"params": {messages:[{from:{from_mobile_no},to:{mobile_no},content:{templateName:{template_name},templateData:{body:{placeholders:{placeholders}}},language:{language}}}]}
        "params": {messages:[{from:"",to:"",content:{templateName:"",templateData:{body:{placeholders:[]}},language:""}}]}
     },
]
const appType=["IMAGE","DOCUMENT","TEXT"];



module.exports={appType }