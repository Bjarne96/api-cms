import mongoose from "../initDb";
import { Request, Response } from 'express';
import { sendResponse } from "./requestServices";
import { IPayment, IProduct, IProductSelected } from '../../schemas';
import { getManyProducts } from "../controllers/productController"
import { addPayment, getHighestInvoice } from "../controllers/paymentController"
import { paypal } from "../utils/messageUtils"

import config = require('../../../config')

const fetch = require('node-fetch')
const cache = require('memory-cache')


var purchaseSchema = new mongoose.Schema({ paypalResponse: { type: String, required: true } }, { strict: false });
var Purchase = mongoose.model('purchases', purchaseSchema);


//after purchasing emails need to be sent and data needs to be written?
export let createPayment = async (req: Request, res: Response) => {
    //validation   
    let warenkorb: Array<IProductSelected> = req.body;
    //Get new Invoice Number
    let oldInvoice: Array<IPayment> = await getHighestInvoice();
    //@ts-ignore
    let newInvoiceNo = oldInvoice[0].invoiceno + 1;
    //Sets Alls Amounts and Items into the PaymentObject 
    let newCreatePaymentObject = await creatPaymentObject(warenkorb);
    //Sets invoice number
    newCreatePaymentObject.transactions[0].invoice_number = newInvoiceNo.toString();
    let typevalidation = await checkCart(warenkorb);
    let productIds = [];
    if (!typevalidation) return (sendResponse(res, "error", 500, "wrong type"));
    for (let i = 0; i < warenkorb.length; i++) {
        productIds.push(warenkorb[i]._id);
    }
    try {
        let products = await getManyProducts(productIds);
        for (let i = 0; i < warenkorb.length; i++) {
            const wkProduct: IProductSelected = warenkorb[i];
            let valid = false;
            for (let j = 0; j < products.length; j++) {
                const product: IProduct = products[j];
                if (wkProduct._id == String(product._id)) {
                    let selector1 = wkProduct.variant.selector_1;
                    let selector2 = wkProduct.variant.selector_2;
                    let price = wkProduct.variant.price;
                    for (let k = 0; k < product.variants.length; k++) {
                        let variant = product.variants[k];
                        //@ts-ignore
                        if (selector1 == variant.selector_1 && selector2 == variant.selector_2 && price == variant.price) {
                            valid = true;
                        }
                    }
                }

            }
            if (!valid) return (sendResponse(res, "error", 500, "wrong item"));
        }
    } catch (err) {
        return (sendResponse(res, "error", 500, "js error"));
    }
    //paypal create payment request
    let paymentRequest = JSON.parse(await createPaypalRequest("POST", config.paypal_createpayment_url, newCreatePaymentObject));
    let approvalURL;
    //Todo real exception handling
    if (paymentRequest == undefined && !paymentRequest.length) return (
        sendResponse(res, "ok", 200, "payment request unsuccsessfull")
    );
    //get Approval Url
    for (let i = 0; i < paymentRequest.links.length; i++) {
        const element = paymentRequest.links[i];
        if (element.rel == "approval_url") {
            approvalURL = element.href;
        }
    }

    //Todo real exception handling
    if (approvalURL == undefined && !approvalURL.length) return (
        sendResponse(res, "ok", 200, "couldnt find approvalurl")
    );
    // save paymentid to payment collection
    let newPayment: IPayment = {
        paymentid: paymentRequest.id,
        invoiceno: newInvoiceNo
    }
    if (!await addPayment(newPayment)) return (sendResponse(res, "ok", 200, "mongodb error"));
    // returns approval url
    return (sendResponse(res, "ok", 200, approvalURL));
}

//creates a payment by calling paypal api
export let checkOrder = async (req: Request, res: Response, next) => {
    let orderid = req.params.id
    return (sendResponse(res, "ok", 200, "jwtPayload"));
}
//get called when paypal sends request
export let webHooks = async (req: Request, res: Response, next) => {
    try {
        let requestString = JSON.stringify(req.body);
        let purchase = {
            "paypalResponse": requestString
        }
        let addPurchase = new Purchase(purchase);
        addPurchase.save((err: mongoose.Error) => { })
        return (sendResponse(res, "ok", 200, "aha"));
    } catch (err) {
        console.log('err', err);
        let errorString = JSON.stringify(err);
        let purchase = {
            "paypalResponse": errorString
        }
        let addPurchase = new Purchase(purchase);
        addPurchase.save((err: mongoose.Error) => { })
        return (sendResponse(res, "ok", 200, "test"));
    }
}
//get called when paypal sends request
export let creatPaymentObject = async (warenkorb: Array<IProductSelected>) => {
    //Set inital counters and objects
    var newCreatePaymentObject = { ...createPaymentModel };
    let subtotalWithTax = 0;
    let subtotalWithoutTax = 0;
    let subTaxTotal = 0;
    //Loops through all products
    for (let i = 0; i < warenkorb.length; i++) {
        //Set const to get data easier
        const element = warenkorb[i];
        //First part of the description string
        let newDescription = element.name + " in ";
        //First character of sku
        let newSku = element.sku;
        //Loops through properties
        for (let j = 0; j < element.properties.length; j++) {
            //Sets const to get data easier
            const prop = element.properties[j];
            //Sets actual selector
            let selector = element.variant["selector_" + (j + 1)];
            //Loops though properties to access single prop
            for (let k = 0; k < prop.length; k++) {
                //sets const to get data easier
                const propElem = prop[k];
                //When the first property gets accessed after the first properties
                if (propElem.id == 0 && j > 0) {
                    //Separator for diffrent kind of props
                    newDescription = newDescription + " & ";
                }
                //compares selector and id to find the fitting name and sku
                if (propElem.id == selector) {
                    newDescription = newDescription + propElem.name;
                    newSku = newSku + propElem.id.toString();
                }
            }
        }
        //final roundings
        let withoutTaxPrice = Math.round(((element.variant.price / 119) * 100) * 100) / 100;
        let taxPrice = Math.round(((element.variant.price / 119) * 19) * 100) / 100;
        let partTax = Math.round((taxPrice * element.count) * 100) / 100
        subTaxTotal = Math.round((subTaxTotal + partTax) * 100) / 100;
        subtotalWithoutTax = Math.round((subtotalWithoutTax + (withoutTaxPrice * element.count)) * 100) / 100;
        subtotalWithTax = subtotalWithTax + (element.count * element.variant.price);
        //Paypal Api Item
        let newItem = {
            "name": element.name,
            "description": newDescription,
            "quantity": element.count.toString(),
            "price": withoutTaxPrice.toString(),
            "sku": newSku,
            "tax": taxPrice.toString(),
            "currency": "EUR"
        }
        //Pushes item to new payment object
        newCreatePaymentObject.transactions[0].item_list.items.push(newItem)
    }
    //Sets the correct amounts
    let amount = newCreatePaymentObject.transactions[0].amount;
    amount.total = (Math.round(subtotalWithTax * 100) / 100).toFixed(2);
    amount.details.subtotal = (Math.round(subtotalWithoutTax * 100) / 100).toFixed(2);
    amount.details.tax = (Math.round(subTaxTotal * 100) / 100).toFixed(2);
    //Returns new structured payment object
    return newCreatePaymentObject;
}
//Paypal generic request
//Method is the http method used in the request
//secondPartUrl is the route at the paypal api you wanna request (everything after the base url)
//Data is used when you post somethig
export let createPaypalRequest = async (method: string, secondPartUrl: string, data?: any) => {
    //checks for activly cached token
    if (!(cache.get('pp_access_token'))) {
        //Get new Token
        let result = JSON.parse(await getAccessToken());
        //puts in cache(key, value, expires_in(seconds))
        cache.put('pp_access_token', result.access_token, result.expires_in)
    }
    //sets token
    let accessToken = cache.get('pp_access_token');
    //sets header
    let header = {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json"
    }
    //Basic options object
    let requestOptions = {
        method: method,
        headers: header
    };
    //Adds data when post request
    if (method == 'POST') {
        requestOptions["body"] = JSON.stringify(data);
    }
    //The final request to payal
    let result = await fetch(config.paypal_base_url + secondPartUrl, requestOptions)
        .then(response => response.text())
        .then(result => { return result })
        .catch(error => { return error });
    return result;

}
//get called to finish the payment after the payee updated the status
export let executePayment = async (req: Request, res: Response) => {
    let new_paypal_getpayment_url = config.paypal_getpayment_url.replace("{payment_id}", req.body.paymentId);
    //get payment and verfiy
    let paymentResponse = await createPaypalRequest("GET", new_paypal_getpayment_url)
    //Todo error handling
    let payment = JSON.parse(paymentResponse);
    //execute payment
    if (payment.payer.status == "VERIFIED") {
        let new_paypal_execute_url = config.paypal_execute_url.replace("{payment_id}", req.body.paymentId);
        let new_paypal_execute_body = { payer_id: req.body.PayerID }
        let executeResponse = await createPaypalRequest(
            "POST",
            new_paypal_execute_url,
            new_paypal_execute_body
        )
        //Todo error handling
        let execute = JSON.parse(paymentResponse);
        if (execute.state == "approved") {
            //send email to customer and production
            return (sendResponse(res, "ok", 200, true));
        } else {
            //send error to admin todo
            return (sendResponse(res, "error", 500, false));
        }
    } else {
        //send error to admin todo
        return (sendResponse(res, "error", 500, "ohno"));
    }
}
//requests paypal access token
export let getAccessToken = async () => {
    let client = config.paypal_client_id;
    let secret = config.paypal_secret;
    let auth = "Basic " + Buffer.from(client + ":" + secret).toString("base64");
    let header = {
        "Authorization": auth,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    let urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");
    let requestOptions = {
        method: 'POST',
        headers: header,
        body: urlencoded
    };
    let result = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", requestOptions)
        .then(response => response.text())
        .then(result => { return result })
        .catch(error => { return error });
    return result;
}
//checks the request body for validity
export let checkCart = async (cart: Array<IProductSelected>) => {
    let defaultcart = {
        "properties": [],
        "_id": "",
        "name": "",
        "variant": {},
        "count": 0,
        "total": 0
    }
    return new Promise<boolean>(resolve => {
        for (let i = 0; i < cart.length; i++) {
            Object.keys(defaultcart).map(key => {
                let value = defaultcart[key];
                let valueTest = cart[i][key];
                let type = typeof (value);
                let typeTest = typeof (valueTest);
                if (typeTest == undefined || typeTest != type) {
                    resolve(false);
                }
            })
        }
        resolve(true);
    })
}
//Basci Paypal Object
export let createPaymentModel = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "transactions": [
        {
            "amount": {
                "total": "0.00",
                "currency": "EUR",
                "details": {
                    "subtotal": "0.00",
                    "tax": "0.00",
                    "shipping": "0.00",
                    "handling_fee": "0.00",
                    "shipping_discount": "0.00",
                    "insurance": "0.00"
                }
            },
            "description": paypal.description,
            "custom": "",
            "invoice_number": "",

            "soft_descriptor": paypal.description,
            "item_list": {
                "items": []
            }
        }],
    "note_to_payer": paypal.note_to_payer,
    "redirect_urls": {
        "return_url": config.paypal_redirect_domain + "success",
        "cancel_url": config.paypal_redirect_domain + "cancel"
    }
}
// to debug newItem
// "originalPrice": element.variant.price.toString(),
// "totalTax": (taxPrice * element.count).toFixed(2),
// "totalPrice": (element.variant.price * element.count).toString(),
// "totalWithoutTaxPrice": (withoutTaxPrice * element.count).toString(),
