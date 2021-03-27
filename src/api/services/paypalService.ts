import { Request, Response } from 'express';
import * as requestService from "./requestServices";
import mongoose from "../initDb";
import { IProduct, IProductSelected } from '../../schemas';
import { getManyProducts } from "../controllers/productController"
import { cache } from 'memory-cache';
const fetch = require('node-fetch')
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
    //paypal access token handling
    getAccessToken();
    //paypal request handling

    return (requestService.sendResponse(res, "ok", 200, "worked"));
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
export let getAccessToken = async () => {
    let client = config.paypal_client_id;
    let secret = config.secret;
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
    console.log('config.paypal_token_url', config.paypal_token_url);
    await fetch(config.paypal_token_url, requestOptions)
        .then(response => {
            response.text();
            console.log(response)
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    //cache.put('paypal_access_token', 'disappear', 100);
    return;
}

//after purchasing emails need to be sent and data needs to be written?
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