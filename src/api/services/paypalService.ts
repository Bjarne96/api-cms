import { Request, Response } from 'express';
import * as requestService from "./requestServices";
import mongoose from "../initDb";
import { IPayment, IProduct, IProductSelected } from '../../schemas';
import { getManyProducts } from "../controllers/productController"
import { addPayment, getHighestInvoice } from "../controllers/paymentController"
const fetch = require('node-fetch')
const cache = require('memory-cache')
import config = require('./../../../config')

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
    if (!typevalidation) return (requestService.sendResponse(res, "error", 500, "wrong type"));
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
            if (!valid) return (requestService.sendResponse(res, "error", 500, "wrong item"));
        }
    } catch (err) {
        return (requestService.sendResponse(res, "error", 500, "js error"));
    }
    if (!(cache.get('pp_access_token'))) {
        //Get new Token
        let result = JSON.parse(await getAccessToken());
        //puts in cache(key, value, expires_in(seconds))
        cache.put('pp_access_token', result.access_token, result.expires_in)
    }
    //paypal create payment request
    let paymentRequest = JSON.parse(await createPaymentRequest(newCreatePaymentObject));
    let approvalURL;
    //Todo real exception handling
    if (paymentRequest == undefined && !paymentRequest.length) return (
        requestService.sendResponse(res, "ok", 200, "payment request unsuccsessfull")
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
        requestService.sendResponse(res, "ok", 200, "couldnt find approvalurl")
    );
    // save paymentid to payment collection
    let newPayment: IPayment = {
        paymentid: paymentRequest.id,
        invoiceno: newInvoiceNo
    }
    if (!await addPayment(newPayment)) return (requestService.sendResponse(res, "ok", 200, "mongodb error"));
    // returns approval url
    return (requestService.sendResponse(res, "ok", 200, approvalURL));
}

//creates a payment by calling paypal api
export let checkOrder = async (req: Request, res: Response, next) => {
    let orderid = req.params.id
    return (requestService.sendResponse(res, "ok", 200, "jwtPayload"));
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
        return (requestService.sendResponse(res, "ok", 200, "aha"));
    } catch (err) {
        console.log('err', err);
        let errorString = JSON.stringify(err);
        let purchase = {
            "paypalResponse": errorString
        }
        let addPurchase = new Purchase(purchase);
        addPurchase.save((err: mongoose.Error) => { })
        return (requestService.sendResponse(res, "ok", 200, "test"));
    }
}
//get called when paypal sends request
export let creatPaymentObject = async (warenkorb: Array<IProductSelected>) => {
    var newCreatePaymentObject = { ...createPaymentModel };
    let subtotalWithTax = 0;
    let subtotalWithoutTax = 0;
    let subTaxTotal = 0;
    for (let i = 0; i < warenkorb.length; i++) {
        const element = warenkorb[i];
        let newDescription = element.name + " in ";
        for (let j = 0; j < element.properties.length; j++) {
            const prop = element.properties[j];
            let selector = element.variant["selector_" + (i + 1)];
            for (let k = 0; k < prop.length; k++) {
                const propElem = prop[k];
                if (propElem.id == 0 && j > 0) {
                    newDescription = newDescription + " & ";
                }
                if (propElem.id == selector) {
                    newDescription = newDescription + propElem.name;
                }
            }
        }
        let withoutTaxPrice = Math.round(((element.variant.price / 119) * 100) * 100) / 100;
        let taxPrice = Math.round(((element.variant.price / 119) * 19) * 100) / 100;
        let partTax = Math.round((taxPrice * element.count) * 100) / 100
        subTaxTotal = Math.round((subTaxTotal + partTax) * 100) / 100;
        subtotalWithoutTax = Math.round((subtotalWithoutTax + (withoutTaxPrice * element.count)) * 100) / 100;
        subtotalWithTax = subtotalWithTax + (element.count * element.variant.price);
        let newItem = {
            "name": element.name,
            "description": newDescription,
            "quantity": element.count.toString(),
            "price": withoutTaxPrice.toString(),
            // "tax": taxPrice.toString(),
            // "originalPrice": element.variant.price.toString(),
            // "totalTax": (taxPrice * element.count).toFixed(2),
            // "totalPrice": (element.variant.price * element.count).toString(),
            // "totalWithoutTaxPrice": (withoutTaxPrice * element.count).toString(),
            "sku": "1", //stock keeping unit
            "currency": "EUR"
        }
        newCreatePaymentObject.transactions[0].item_list.items.push(newItem)
    }
    let amount = newCreatePaymentObject.transactions[0].amount;
    amount.total = (Math.round(subtotalWithTax * 100) / 100).toFixed(2);
    amount.details.subtotal = (Math.round(subtotalWithoutTax * 100) / 100).toFixed(2);
    amount.details.tax = (Math.round(subTaxTotal * 100) / 100).toFixed(2);
    return newCreatePaymentObject;
}
//Paypal request
export let createPaymentRequest = async (paymentObject) => {
    let accessToken = cache.get('pp_access_token');
    let header = {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json"
    }
    let body = JSON.stringify(paymentObject);
    let requestOptions = {
        method: 'POST',
        headers: header,
        body: body
    };
    let result = await fetch(config.paypal_createpayment_url, requestOptions)
        .then(response => response.text())
        .then(result => { return result })
        .catch(error => { return error });
    return result;

}
//get called to finish the payment after the payee updated the status
export let executePayment = async (req: Request, res: Response) => {

    return;
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
            "description": config.paypal_description,
            "custom": "",
            "invoice_number": "",

            "soft_descriptor": config.paypal_description,
            "item_list": {
                "items": []
            }
        }],
    "note_to_payer": config.paypal_note_to_payer,
    "redirect_urls": {
        "return_url": config.paypal_redirect_domain + "success",
        "cancel_url": config.paypal_redirect_domain + "cancel"
    }
}
