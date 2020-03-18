import {Request, Response} from "express";
import Article from "../methods/Article";
import * as mongoose from "mongoose";
import * as requestService from "./../services/requestServices";

//GETs -> one Article
export let getArticle = (req: Request, res: Response) => {
    Article.findById(req.params.id, (err: mongoose.Error, Article: any) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, Article)
        };
    })
}
//PUTs -> an new Article into the table
export let addArticle = (req: Request, res: Response) => {
    let addArticle = new Article(req.body);
    addArticle.save((err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, addArticle)
        };
    })
}
//DELETEs an Article
export let deleteArticle = (req: Request, res: Response) => {
    Article.deleteOne({_id : req.params.id}, (err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, req.params.id)
        };
    })
}

//POST -> Updates an Article
export let updateArticle = (req: Request, res: Response) => {
    Article.findByIdAndUpdate(req.params.id, req.body, (err: mongoose.Error) => {
        if(err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            getArticle(req, res);
        };
    })
}

export default getArticle;
