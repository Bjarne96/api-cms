import ses from "../initSES";
import { Request, Response } from 'express';
import * as requestService from "./requestServices";
import Handlebars from "handlebars"
import { email, email_selector } from "../utils/messageUtils";
import { createPaypalRequest } from "./paypalServices";
import config = require('../../../config');
var fs = require('fs');
var srcPath = __dirname.replace("dist", "src");


var charset = "UTF-8";
var email_order = fs.readFileSync(srcPath + "/../templates/email_order.html", charset).toString();
var email_contact = fs.readFileSync(srcPath + "/../templates/email_contact.html", charset).toString();


//send email
export let proccessContact = async (req: Request, res: Response) => {
    //Try to send the email.
    await ses.sendEmail(sesParams, function (err, data) {
        // If something goes wrong, print an error message.
        if (err) {
            return (requestService.sendResponse(res, "ok", 200, err.message));
        } else {
            return (requestService.sendResponse(res, "ok", 200, data.MessageId));
        }
    });

}

//send email
export let sendOrderMail = async (req: Request, res: Response) => {
    //debug all of this
    //dummy for paypal data
    let ppid = "PAYID-MBY5X3A6L71360581927511R";
    let new_paypal_getpayment_url = config.paypal_getpayment_url.replace("{payment_id}", ppid);
    //get payment and verfiy
    let paymentResponse = await createPaypalRequest("GET", new_paypal_getpayment_url)
    //exception handling here
    let payment = JSON.parse(paymentResponse);
    let new_order_paymentmethod = email.order_paymentmethod;
    let foundPaymentMethod = false;
    //todo create payment replacer
    console.log('email_selector', email_selector);
    for (let i = 0; i < email_selector.payment_method.length; i++) {
        const element = email_selector.payment_method[i];
        if (element.id == payment.payer.payment_method) {
            foundPaymentMethod = true;
            new_order_paymentmethod = new_order_paymentmethod.replace("{payment}", element.response);
        }
    }
    if (!foundPaymentMethod) {
        //todo error handling
        new_order_paymentmethod = new_order_paymentmethod.replace("{payment}", "Paypal");
    }
    //todo create new items with subtotals
    //Set Data options for Handlebars
    let transaction = payment.transactions[0];
    let ppItems = transaction.item_list.items;
    let items = [];
    for (let i = 0; i < ppItems.length; i++) {
        const element = ppItems[i];
        let newitem = {
            name: element.description,
            //todo correct price
            preis: (parseInt(element.price) + parseInt(element.tax)).toString().replace(".", ",")
        }
        items.push(newitem);
    }
    var options = {
        items: items,
        total: transaction.amount.total,
        shipping_address: transaction.item_list.shipping_address,
        //todo get corret invoice details
        invoice_address: transaction.item_list.shipping_address,
        order_confirmation: email.order_confirmation,
        order_donotreply: email.order_donotreply,
        order_preheader: email.order_preheader,
        sender_name: email.sender_name,
    };
    //return (requestService.sendResponse(res, "ok", 200, options));

    let newParams = { ...sesParams };
    newParams.Message.Subject.Data = email.order_subject;
    //handlebars
    var template = Handlebars.compile(email_order);
    var result = template(options);
    newParams.Message.Body.Html.Data = result.toString();

    await ses.sendEmail(newParams, function (err, data) {
        // If something goes wrong, print an error message.
        if (err) {
            return (requestService.sendResponse(res, "ok", 200, err.message));
        } else {
            return (requestService.sendResponse(res, "ok", 200, data.MessageId));
        }
    });

}

const sender = "Tiefschlafen.de <info@tiefschlafen.de>";

//const recipient = "bjarne.abb@gmail.com";
const recipient = "produktion@tiefschlafen.de";

//handlebars string todo
const body_text = "";

var sesParams = {
    Source: sender,
    Destination: {
        ToAddresses: [
            recipient
        ],
    },
    Message: {
        Subject: {
            Data: "",
            Charset: charset
        },
        Body: {
            Text: {
                Data: body_text,
                Charset: charset
            },
            Html: {
                Data: "",
                Charset: charset
            }
        }
    }
};