import { Request, Response } from "express";
import Article from "../methods/article";
import * as mongoose from "mongoose";
import * as requestService from "./../services/requestServices";
import { IArticle } from "../../schemas";

//GET all Articles
export let getAllArticles = (req: Request, res: Response) => {
    Article.find((err: mongoose.Error, articles: any) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, articles)
        };
    })
}

//GETs -> one Article
export let getArticle = (req: Request, res: Response) => {
    Article.findById(req.params.id, (err: mongoose.Error, Article: any) => {
        if (err) {
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
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, addArticle)
        };
    })
}
//DELETEs an Article
export let deleteArticle = (req: Request, res: Response) => {
    Article.deleteOne({ _id: req.params.id })
        .then((data) => {
            requestService.sendResponse(res, "ok", 200, req.params.id)
        })
        .catch((err) => {
            requestService.sendResponse(res, "error", 500, err)
        });
}

//POST -> Updates an Article
export let updateArticle = (req: Request, res: Response) => {
    Article.findByIdAndUpdate(req.params.id, req.body, (err: mongoose.Error) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            getArticle(req, res);
        };
    })
}

//Function -> returns Articles
export let getManyArticles = (Ids: Array<mongoose.Types.ObjectId>) => {
    return new Promise<Array<IArticle>>(resolve => {
        let newArray = [];
        for (let i = 0; i < Ids.length; i++) {
            newArray.push(Ids[i])
        }
        let searchparam = { '_id': { $in: newArray } }
        Article.find(
            searchparam, (err: mongoose.Error, articles: Array<IArticle>) => {
                if (err) {
                    console.log('err', err);
                    resolve([]);//correct error handling
                } else {
                    resolve(articles);
                };
            })
    })
}

export default getArticle;
