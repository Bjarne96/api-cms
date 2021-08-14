import { Request, Response } from "express";
import Customer from "../methods/customer";
import * as mongoose from "mongoose";
import * as requestService from "./../services/requestServices";
import { IUtilReturn } from "../interfaces";
import * as cryptoUtils from "./../utils/cryptoUtils";
import * as moment from 'moment'
import * as userUtils from "../utils/userUtils";

//GET all Customers
export let getAllCustomers = (req: Request, res: Response) => {
    Customer.find((err: mongoose.Error, customers: any) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, customers)
        };
    })
}
//GET one Customer
export let getCustomer = (req: Request, res: Response) => {
    Customer.findById(req.params.id, (err: mongoose.Error, customer: any) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, customer)
        };
    })
}

//GETs Customers by Param
export let getCustomerByParam = (req: Request, res: Response) => {
    const query = {};
    query[req.body.param] = req.body.value;
    Customer.find(query, (err: mongoose.Error, customers: any) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, customers)
        };
    })
}

//PUT a new Customer into the table
export let addCustomer = async (req: Request, res: Response) => {
    let verifyResponse: IUtilReturn = await cryptoUtils.verifyToken(req.headers['authorization']);
    let user = await userUtils.getUserByParam(verifyResponse.result.email, "email");
    let date_create = moment(new Date()).toString();
    req.body.user_id = user[0]._id;
    req.body.date_created = date_create;
    let newCustomer = new Customer(req.body);
    newCustomer.save((err: mongoose.Error) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, newCustomer)
        };
    })
}
//DELETEs a Customer
export let deleteCustomer = (req: Request, res: Response) => {
    Customer.deleteOne({ _id: req.params.id })
        .then((data) => {
            requestService.sendResponse(res, "ok", 200, req.params.id)
        })
        .catch((err) => {
            requestService.sendResponse(res, "error", 500, err)
        })
}
//POST -> updates a Customer
export let updateCustomer = (req: Request, res: Response) => {
    Customer.findByIdAndUpdate(req.params.id, req.body, (err: mongoose.Error) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            getCustomer(req, res);
        };
    })
}

export default getAllCustomers;
