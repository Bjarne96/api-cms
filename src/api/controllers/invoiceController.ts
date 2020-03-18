import {Request, Response} from "express";
import Invoice from "../methods/invoice";
import * as mongoose from "mongoose";
import * as requestService from "./../services/requestServices";

//GETs -> all Invoices
export let getAllInvoices = (req: Request, res: Response) => {
    Invoice.find(async (err: mongoose.Error, invoices: any) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, invoices)
        };
    })
}
//GETs -> one Invoice
export let getInvoice = (req: Request, res: Response) => {
    Invoice.findById(req.params.id, (err: mongoose.Error, invoice: any) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, invoice)
        };
    })
}
//PUTs -> an new Invoice into the table
export let addInvoice = (req: Request, res: Response) => {
    let addInvoice = new Invoice(req.body);
    addInvoice.save((err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, addInvoice)
        };
    })
}
//DELETEs -> an Invoice

export let deleteInvoice = (req: Request, res: Response) => {
    Invoice.deleteOne({_id : req.params.id}, (err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, req.params.id)
        };
    })
}

//POST -> Updates a Invoice

export let updateInvoice = (req: Request, res: Response) => {
    Invoice.findByIdAndUpdate(req.params.id, req.body, (err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            getInvoice(req, res);
        };
    })
}

export default getAllInvoices;
