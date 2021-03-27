import { Request, Response } from 'express';
import * as requestService from "./requestServices";
import mongoose from "../initDb";
import { IProduct, IProductSelected } from '../../schemas';
import { getManyProducts } from "../controllers/productController"
const fetch = require('node-fetch')
const cache = require('memory-cache')
import config = require('./../../../config')

var purchaseSchema = new mongoose.Schema({ paypalResponse: { type: String, required: true } }, { strict: false });
var Purchase = mongoose.model('purchases', purchaseSchema);


//after purchasing emails need to be sent and data needs to be written?
export let createPayment = async (req: Request, res: Response) => {
    //validation
    let warenkorb: Array<IProductSelected> = req.body;
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
    let paymentObject = await creatPaymentObject(warenkorb);
    let paymentRequest = JSON.parse(await createPaymentRequest(paymentObject));
    let approvalURL;
    //Todo real exception handling
    if (paymentRequest == undefined && !paymentRequest.length) return (requestService.sendResponse(res, "ok", 200, "payment request unsuccsessfull"));
    for (let i = 0; i < paymentRequest.links.length; i++) {
        const element = paymentRequest.links[i];
        if (element.rel == "approval_url") {
            approvalURL = element.href;
        }
    }
    if (paymentRequest == undefined && !paymentRequest.length) return (requestService.sendResponse(res, "ok", 200, "couldnt find approvalurl"));
    console.log('approvalURL', approvalURL);
    return (requestService.sendResponse(res, "ok", 200, approvalURL));
}

//creates a payment by calling paypal api
export let checkOrder = async (req: Request, res: Response, next) => {
    let orderid = req.params.id
    console.log('orderid', orderid);
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
    for (let i = 0; i < warenkorb.length; i++) {
        const element = warenkorb[i];
        let newItem = {
            "name": element.name,
            "description": element.variant.description, //change html to text with regex
            "quantity": element.count,
            "price": element.variant.price,
            "sku": "1", //?
            "currency": "EUR"
        }
        basicPaymenObject.transactions[0].item_list.items.push(newItem)
    }
    return basicPaymenObject;
}
export let createPaymentRequest = async (paymentObject) => {
    console.log('paymentObject', paymentObject);
    console.log('paymentObject.transactions[0].item_list.items', paymentObject.transactions[0].item_list.items);
    let accessToken = cache.get('pp_access_token');
    console.log('accesstoken', accessToken);
    let header = {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json"
    }
    let body = JSON.stringify(paymentObject);
    let testi = JSON.stringify(test);
    let requestOptions = {
        method: 'POST',
        headers: header,
        body: testi
    };
    console.log('config.paypal_createpayment_url', config.paypal_createpayment_url);
    let result = fetch("https://api-m.sandbox.paypal.com/v1/payments/payment", requestOptions)
        .then(response => response.text())
        .then(result => { return result })
        .catch(error => { return error });
    return result;
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

export let basicPaymenObject = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "transactions": [{
        "amount": {
            "total": "21.50",
            "currency": "EUR",
            "details": {
                "subtotal": "15.00",
                "tax": "2.00",
                "shipping": "2.50",
                "handling_fee": "1.00",
                "shipping_discount": "-1.00",
                "insurance": "2.00"
            }
        },

        "description": "This is the payment transaction description.",
        "custom": "This is a hidden value",
        "invoice_number": "unique_invoice_number",

        "soft_descriptor": "your order description",
        "item_list": {
            "items": []
        }
    }],
    "note_to_payer": "Contact us for any questions on your order.",
    "redirect_urls": {
        "return_url": "http://example.com/success",
        "cancel_url": "http://example.com/cancel"
    }
}

export let test = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "transactions": [{
        "amount": {
            "total": "21.50",
            "currency": "EUR",
            "details": {
                "subtotal": "15.00",
                "tax": "2.00",
                "shipping": "2.50",
                "handling_fee": "1.00",
                "shipping_discount": "-1.00",
                "insurance": "2.00"
            }
        },

        "description": "This is the payment transaction description.",
        "custom": "This is a hidden value",
        "invoice_number": "unique_invoice_number",

        "soft_descriptor": "your order description",
        "item_list": {
            "items": [{
                "name": "Item 1",
                "description": "add description here",
                "quantity": "2",
                "price": "10.00",
                "sku": "1",
                "currency": "EUR"
            },
            {
                "name": "Voucher",
                "description": "discount on your order",
                "quantity": "1",
                "price": "-5.00",
                "sku": "vouch1",
                "currency": "EUR"
            }
            ]
        }
    }],
    "note_to_payer": "Contact us for any questions on your order.",
    "redirect_urls": {
        "return_url": "http://example.com/success",
        "cancel_url": "http://example.com/cancel"
    }
}
