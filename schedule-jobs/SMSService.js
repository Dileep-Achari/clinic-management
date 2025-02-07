const axios = require('axios');
const _twilio = require('twilio');
const querystring = require('querystring');
const format = require('string-format');
format.extend(String.prototype, {});

/**
 * SMS Service for handling different vendors
 */


    async function sendSMS(vendor, data) {
        // Get Vendor Details here 
        // console.log(this.config);
        switch (vendor.vendorCd) {
            case 'BULK_SMS_GATEWAY':
                return await sendViaBulkSmsGateway(vendor, data);
            case 'TWILIO':
                return await sendViaTwilio(vendor, data);
            case 'SMS_COUNTRY':
                return await sendViaSmsCountry(vendor, data);
            case 'VOX_PASS':
                return await sendViaVoxPass(vendor, data);
            default:
                throw new Error('Invalid SMS vendor specified.');
        }
    }

    /**
     * Send SMS via Bulk SMS Gateway
     */
    async function sendViaBulkSmsGateway(vendor, data) {
        if (typeof vendor.url !== 'string' || !vendor.url.trim()) {
            throw new Error('Invalid URL provided');
        }
        let smsObj = {
            "MOB_NUMBER": data.toSMSMobile,
            "MOB_MESSAGE": data.smsTemplate
        }
        let _url = vendor.url.format(smsObj);
        const uri = encodeURI(_url);
        return axios.get(uri)
            .then(result => {
                console.log("Response:", result.data);
                return result.data; 
            })
            .catch(error => {
                console.error("Error occurred during GET request:", error.message);
                return {error, data};
            });
    }

    /**
     * Send SMS via Twilio
     */
    async function sendViaTwilio(vendor, data) {
        try {
            const client = _twilio(vendor.accountSid, vendor.authToken);
            const response = await client.messages.create({
                body: data.smsTemplate,
                from: vendor.from,
                to: `+91${data.toSMSMobile}`
            })
            console.log("response", response)
            return {response, data};
        } catch (error) {
            console.error('Twilio Error:', error.message);
            return {error, data};
        }
    }

    /**
     * Send SMS via SMS Country
     */
    async function sendViaSmsCountry(vendor, data) {
        if (typeof vendor.vendorUrl !== 'string' || !vendor.vendorUrl.trim()) {
            throw new Error('Invalid URL provided');
        }
        let smsObj = {
            "MOB_NUMBER": data.toSMSMobile,
            "MOB_MESSAGE": data.smsTemplate
        }
        let _url = vendor.vendorUrl.format(smsObj);
        const uri = encodeURI(_url);
        return axios.get(uri)
            .then(result => {
                console.log("Response:", result.data); // Logging only the data
                return { result, data }; // Return only the data to the caller
            })
            .catch(error => {
                console.error("Error occurred during GET request:", error.message);
                throw error; // Re-throwing the error for caller handling
            });
    }

    /**
     * Send SMS via VoxPass
     */
    async  function sendViaVoxPass(vendor, data) {
      /*  if (!(vendor && smsObj && smsObj.recipient?.mobileNo && smsObj.body && vendor.projectId && vendor.authToken && vendor.templateId)) {
            const missingFields = [];
            if (!vendor) missingFields.push("sms vendor URL");
            if (!smsObj.recipient.mobileNo) missingFields.push("mobile number");
            if (!smsObj.body) missingFields.push("template");
            if (!vendor.templateId) missingFields.push("template ID");
            if (!vendor.projectId) missingFields.push("project ID");
            if (!vendor.authToken) missingFields.push("auth token");
            throw new Error(`Please provide valid details: ${missingFields.join(", ")}`);
        }*/

        // const formattedMobileNumbers = smsObj.recipient?.mobileNo.includes(',')
        //     ? smsObj.recipient?.mobileNo.split(',').map(mob => `+91${mob}`).join(",")
        //     : `+91${smsObj.recipient?.mobileNo}`;
        // smsObj.recipient?.mobileNo = formattedMobileNumbers;

        let formattedMobileNumbers;

        if(data.toSMSMobile && data.toSMSMobile.includes(',')){
            formattedMobileNumbers = data.toSMSMobile.split(',').map(mob => `+91${mob}`).join(',')
        }
        else if(data.toSMSMobile){
            formattedMobileNumbers = `+91${data.toSMSMobile}`
        }

        try {
            const response = await axios.post(
                vendor.vendorUrl,
                querystring.stringify({
                    projectid: vendor.projectId,
                    authtoken: vendor.smsAuthToken,
                    to: data.toSMSMobile,
                    // template_id: vendor.templateId,
                    body: vendor.smsTemplate,
                    from: vendor.from,
                }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );

            if (response.data.status === "Success") {
                return data.toSMSMobile.includes(',') ? response.data.resp[0].id : response.data.id;
            } else {
                throw new Error(JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("Error sending SMS:", error.message);
            throw error;
        }
    }

module.exports = { sendSMS }
