import {Request, Response} from "express";
import Product from "../methods/product";
import * as mongoose from "mongoose";
import * as requestService from "./../services/requestServices";

//GET one Product
export let getProduct = (req: Request, res: Response) => {
    Product.findById(req.params.id, (err: mongoose.Error, Product: any) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, Product)
        };
    })
}
//PUT a new Product into the table
export let addProduct = (req: Request, res: Response) => {
    let addProduct = new Product(req.body);
    addProduct.save((err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, addProduct)
        };
    })
}

//DELETEs a Product
export let deleteProduct = (req: Request, res: Response) => {
    Product.deleteOne({_id : req.params.id}, (err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, req.params.id)
        };
    })
}

//POST -> updates a Product
export let updateProduct = (req: Request, res: Response) => {
    Product.findByIdAndUpdate(req.params.id, req.body, (err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            getProduct(req, res);
        };
    })
}

export default getProduct;
