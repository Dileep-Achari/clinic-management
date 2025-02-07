'use strict';
const _axios = require('axios');
const _ = require('underscore');


async function sendPushNotification(vendor, data) {
    let title = /*data.NOTIF_TITLE.format(data) ||*/ "Appointment Booking";
    let message = /*data.NOTIF_MSG.format(data) || */"Your Appointment is booked";

    let _params = {
        "orgArn": vendor.pushNotificationUrl+vendor.docProjectId,
        "fcmToken": data.toFCMToken,
        "title": title,
        "body": message,
        "image": ""
    };

    let _resp = await _axios.post("https://abha.doctor9.com/aws-notification-api/send-notification", _params);
    // log(`PUSH-NOTIFICATION: SEND SUCCESSFULLY ${data.templateName}`)
    console.log("_resp", _resp);
    return {_resp, data}
}
module.exports = { sendPushNotification }