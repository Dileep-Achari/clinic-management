// const nodemailer = require("nodemailer");

// module.exports = function (hostObj, toEmail, subject, body) {
//     return new Promise((resolve, reject) => {
//         // resolve("564546-654654-654654-654465"); // dummy
//         // reject(new Error("emeil error")); // dummy

//         try {
//         // hostObj.HOST_EMAIL ="support@softhealth.co.in";
//         // hostObj.HOST_EMAIL_PWD ="emrSupport$123";
//           //console.log("hostObj",hostObj );
//             nodemailer.createTestAccount((err, account) => {
//                 if (err) {
//                     reject(err);
//                 }
//                 else {
//                     let transporter = nodemailer.createTransport(
//                         {
//                            host: hostObj.serverHost,
//                            port: hostObj.port,
//                            secure: (hostObj.port == 465 ? true : false), // true for 465, false for other ports /no secure->587
// 						   //service: 'Godaddy',
//                             service: 'Gmail',
//                             auth: {
//                                 user: hostObj.hostEmail,
//                                 pass: hostObj.hostEmailPwd
//                             },
//                             logger: false,
//                             debug: true // include SMTP traffic in the logs
//                         },
//                         {
//                             from: hostObj.hostEmail,
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



const nodemailer = require("nodemailer");

module.exports = function (hostObj, toEmail, subject, body) {
    return new Promise((resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com', // Gmail SMTP server
                port: 465, // Port for SSL
                secure: true, // Use SSL
                auth: {
                    user: hostObj.hostEmail, // Your Gmail address
                    pass: hostObj.hostEmailPwd // App Password
                },
                logger: false,
                debug: true // Enable debugging
            });

            let message = {
                from: hostObj.hostEmail, // Sender address
                to: toEmail, // Recipient address
                subject: subject, // Email subject
                html: body // Email body (HTML)
            };

            transporter.sendMail(message, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    reject(error);
                } else {
                    console.log("Email sent successfully:", info);
                    resolve(JSON.stringify(info));
                }
                transporter.close(); // Close the transporter
            });
        } catch (ex) {
            console.error("Exception occurred:", ex);
            reject(ex);
        }
    });
};