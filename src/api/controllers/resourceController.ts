import {Request, Response} from "express";
var formidable = require('formidable');
var fs = require('fs');
import Resource from "../methods/Resource";
import * as mongoose from "mongoose";
import * as requestService from "./../services/requestServices";
import * as messageUtils from "./../utils/messageUtils"
import config = require('./../../../config')

//GETs -> all Resources
export let getAllResources = (req: Request, res: Response) => {
    Resource.find((err: mongoose.Error, resources: any) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, resources)
        };
    })
}

//GETs -> one Resource
export let getResource = (req: Request, res: Response) => {
    Resource.findById(req.params.id, (err: mongoose.Error, Resource: any) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, Resource)
        };
    })
}

//PUTs -> a new Resource into the table
export let addResource = (req: Request, res: Response) => {
    let addResource = new Resource(req.body);
    addResource.save((err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, addResource)
        };
    })
}

//DELETEs -> a Resource
export let deleteResource = (req: Request, res: Response) => {
    Resource.deleteOne({_id : req.params.id}, (err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, req.params.id)
        };
    })
}

//POSTs -> updates a Resource
export let updateResource = (req: Request, res: Response) => {
    Resource.findByIdAndUpdate(req.params.id, req.body, (err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            getResource(req, res);
        };
    })
}

export let fileupload = (req: any, res: Response) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //exceptions fpr 20mb size, jp/png type or undefined file upload
        ////console.log("files", files)
        if(files == undefined || files.file === undefined || files.file.size === undefined || files.file.type === undefined) return(requestService.sendResponse(res, "error", 500, messageUtils.upload.undefined))
        //console.log("files.file.size",files.file.size)
        if(files.file.size >= 20000000) return(requestService.sendResponse(res, "error", 500, messageUtils.upload.size))
        //console.log("files.file.type",files.file.type)
        if(files.file.type !== "image/png" && files.file.type !== "image/jpeg") return(requestService.sendResponse(res, "error", 500, messageUtils.upload.type))
        let oldpath = files.file.path;
        let newpath = __dirname + "/../files/" + files.file.name;
        let path = config.web_local_url + "/files/"+ files.file.name;
        fs.rename(oldpath, newpath, function (err) {
            if(err) {
                requestService.sendResponse(res, "error", 500, err)
            } else {
                //sets filename and path into req.body
                req.body = {name: files.file.name, path: path};
                addResource(req, res);
            };
        });
    })
}

export default getAllResources;