import { Request, Response } from "express";
import User from "../methods/user";
import * as mongoose from "mongoose";
import * as requestService from "./../services/requestServices";

//GETs -> all Users
export let getAllUsers = (req: Request, res: Response) => {
    User.find((err: mongoose.Error, users: any) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, users)
        };
    })
}
//GETs -> one User
export let getUser = (req: Request, res: Response) => {
    User.findById(req.params.id, (err: mongoose.Error, user: any) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, user)
        };
    })
}
//PUTs -> a new Customer into the table
export let addUser = (req: Request, res: Response) => {
    let newUser = new User(req.body);
    newUser.save((err: mongoose.Error) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, newUser)
        };
    })
}
//DELETEs -> a User
export let deleteUser = (req: Request, res: Response) => {
    User.deleteOne({ _id: req.params.id })
        .then((data) => {
            requestService.sendResponse(res, "ok", 200, req.params.id)
        })
        .catch((err) => {
            requestService.sendResponse(res, "error", 500, err)
        })
}
//POST -> Updates a User
export let updateUser = (req: Request, res: Response) => {
    User.findByIdAndUpdate(req.params.id, req.body, (err: mongoose.Error) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            getUser(req, res);
        };
    })
}

