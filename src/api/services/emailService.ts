import { Request, Response } from 'express';
import * as requestService from "./requestServices";
import ses from "../initSES";

//send email
export let proccessContact = async (req: Request, res: Response) => {
    console.log('req.body', req.body);
    //Try to send the email.
    await ses.sendEmail(params, function (err, data) {
        // If something goes wrong, print an error message.
        if (err) {
            return (requestService.sendResponse(res, "ok", 200, err.message));
        } else {
            return (requestService.sendResponse(res, "ok", 200, data.MessageId));
        }
    });

}

//send email
export let sendMail = async (req: Request, res: Response) => {
    console.log('req.body', req.body);
    //Try to send the email.
    await ses.sendEmail(params, function (err, data) {
        // If something goes wrong, print an error message.
        if (err) {
            return (requestService.sendResponse(res, "ok", 200, err.message));
        } else {
            return (requestService.sendResponse(res, "ok", 200, data.MessageId));
        }
    });

}

const sender = "Sender Name <info@tiefschlafen.de>";
//const recipient = "bjarne.abb@gmail.com";
const recipient = "info@tiefschlafen.de";
const subject = "Amazon SES Test (AWS SDK for JavaScript in Node.js)";
const body_text = "Amazon SES Test (SDK for JavaScript in Node.js)\r\n"
    + "This email was sent with Amazon SES using the "
    + "AWS SDK for JavaScript in Node.js.";
const body_html = `<html>
<head></head>
<body>
  <h1>Amazon SES Test (SDK for JavaScript in Node.js)</h1>
  <p>This email was sent with
    <a href='https://aws.amazon.com/ses/'>Amazon SES</a> using the
    <a href='https://aws.amazon.com/sdk-for-node-js/'>
      AWS SDK for JavaScript in Node.js</a>.</p>
</body>
</html>`;
const charset = "UTF-8";
var params = {
    Source: sender,
    Destination: {
        ToAddresses: [
            recipient
        ],
    },
    Message: {
        Subject: {
            Data: subject,
            Charset: charset
        },
        Body: {
            Text: {
                Data: body_text,
                Charset: charset
            },
            Html: {
                Data: body_html,
                Charset: charset
            }
        }
    }
};