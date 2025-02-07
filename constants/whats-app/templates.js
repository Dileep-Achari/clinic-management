const hostDtls=require('../whats-app/vendor_details');

const tmpl_dtls=[
    {
        "url":"whatsapp/1/message/template",
        "templateName":"otp_patient_app_login",    
		"type":"TEXT"
    },
    {
        "url":"whatsapp/1/message/template",
        "templateName":"patient_assement_pdf",
		"type":"DOCUMENT"
    },
    {
    "url":"whatsapp/1/message/template",
    "templateName": "patient_lab_reports_with_img",
	"type":"IMAGE"
    }
]

function getTmpl(params){
    const getHostDtls = hostDtls.find(h => (h.HOST === params.host));
    if(getHostDtls){
        const temlDtls=tmpl_dtls.find(t=>(t.type==params.type));
        if(temlDtls){
            return {"status":1,"data":{"hData":getHostDtls,"tData":temlDtls}
            }
        }
        else{
            return {"message":"No template data found"}
        }    
    }
    else{
        return {"message":"No host found"}
    }
}


module.exports={
    getTmpl
}