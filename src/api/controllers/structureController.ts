import {Request, Response} from "express";
import Structure from "../methods/structure";
import * as mongoose from "mongoose";
import * as requestService from "../services/requestServices";
import { IDependendStructure } from "../../schemas";

//GET all Structures
export let getAllStructures = (req: Request, res: Response) => {
    Structure.find((err: mongoose.Error, structures: any) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, structures)
        };
    })
}

//GETs -> one Structure
export let getStructure = (req: Request, res: Response) => {
    Structure.findById(req.params.id, (err: mongoose.Error, Structure: IDependendStructure) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, Structure)
        };
    })
}
//PUTs -> an new Structure into the table
export let addStructure = (req: Request, res: Response) => {
    let addStructure = new Structure(req.body);
    addStructure.save((err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, addStructure)
        };
    })
}
//DELETEs an Structure
export let deleteStructure = (req: Request, res: Response) => {
    Structure.deleteOne({_id : req.params.id}, (err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, req.params.id)
        };
    })
}

//POST -> Updates an Structure
export let updateStructure = (req: Request, res: Response) => {
    Structure.findByIdAndUpdate(req.params.id, req.body, (err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            getStructure(req, res);
        };
    })
}

export default getStructure;
