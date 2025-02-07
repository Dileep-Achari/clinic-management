// const nodemailer = require("nodemailer");

// module.exports = function (hostObj, toEmail, subject, body) {
//     return new Promise((resolve, reject) => {
//         // resolve("564546-654654-654654-654465"); // dummy
//         // reject(new Error("emeil error")); // dummy

//         try {
//         hostObj.HOST_EMAIL ="support@softhealth.co.in";
//         hostObj.HOST_EMAIL_PWD ="emrSupport$123";
//           //console.log("hostObj",hostObj );
//             nodemailer.createTestAccount((err, account) => {
//                 if (err) {
//                     reject(err);
//                 }
//                 else {
//                     let transporter = nodemailer.createTransport(
//                         {
//                            host: hostObj.SERVER_HOST,
//                            port: hostObj.PORT,
//                            secure: (hostObj.PORT == 465 ? true : false), // true for 465, false for other ports /no secure->587
// 						   //service: 'Godaddy',
//                             service: 'Gmail',
//                             auth: {
//                                 user: hostObj.HOST_EMAIL,
//                                 pass: hostObj.HOST_EMAIL_PWD
//                             },
//                             logger: false,
//                             debug: true // include SMTP traffic in the logs
//                         },
//                         {
//                             from: hostObj.HOST_EMAIL,
//                             headers: {
//                                 //'X-Laziness-level': 1000 // just an example header, no need to use this
//                             }
//                         }
//                     );

//                     let message = {
//                         to: toEmail,
//                         subject: subject,
//                         html: body
//                     };
//                    // console.log("transporter",transporter)
//                     transporter.sendMail(message, (error, info) => {
//                         if (error) {
// 							                console.log("error",error);
//                             reject(error);
//                         }

//                         transporter.close();
// 						            console.log("info", info);
//                         resolve(JSON.stringify(info));
//                     });
//                 }                
//             });
//         }
//         catch (ex) {
// 			      console.log("ex",ex);
//             reject(ex);
//         }
//     });
// }

'use strict';
const nodemailer = require("nodemailer");

module.exports = function (hostObj, toEmail, subject, body) {
    //console.log("hostObj, toEmail, subject, body",hostObj, toEmail, subject, body)
    return new Promise((resolve, reject) => {
        // resolve("564546-654654-654654-654465"); // dummy
        // reject(new Error("emeil error")); // dummy

        try {
            // hostObj.HOST_EMAIL = "support@softhealth.co.in";
            // hostObj.HOST_EMAIL_PWD = "ifdconnkcwzgykgh";
            //console.log("hostObj",hostObj );
            nodemailer.createTestAccount((err, account) => {
                if (err) {
                    reject(err);
                }
                else {
                    let transporter = nodemailer.createTransport({
                            service: 'Gmail',
                            auth: {
                                host: hostObj.SERVER_HOST,
                                port: hostObj.PORT,
                                secure: (hostObj.PORT == 465 ? true : false),
                                user: hostObj.HOST_EMAIL,
                                pass: hostObj.HOST_EMAIL_PWD
                            },
                        });

                    let message = {
                        from: hostObj.HOST_EMAIL,
                        to: toEmail,
                        subject: subject,
                        html: body
                    };
                    //console.log("message",message)
                    transporter.sendMail(message, (error, info) => {
                        if (error) {
                            console.log("error", error);
                            reject(error);
                        }

                        transporter.close();
                        console.log("info", info);
                        resolve(JSON.stringify(info));
                    });
                }
            });
        }
        catch (ex) {
            console.log("ex", ex);
            reject(ex);
        }
    });
}