import * as resourceUtils from "../utils/resourceUtils";
import * as articleUtils from "../utils/articleUtils";
import * as requestService from "./requestServices";
import { IDependendArticle, IArticle } from "../../schemas";
import mongoose from "../initDb";

//Posts a new User into the table if the email doesnt already exists
export let loadArticles = async (req, res) => {
    let articles: Array<IDependendArticle> = await articleUtils.getAllArticles();
    let newArray:any = articles;
    for(let i = 0; i < articles.length; i++) {
        let articlePictures = articles[i].pictures;
        if(!articlePictures.length) continue;
        let pictures = await resourceUtils.getManyResources(articlePictures);
        for(let j = 0; j < pictures.length; j++) {
            newArray[i].pictures[j] = pictures[j];
        }
    }
    let newArticles: Array<IArticle> = newArray;
    return(requestService.sendResponse(res, "ok", 200, newArticles));
}

//Posts a new User into the table if the email doesnt already exists
export let loadManyArticles = async (req, res) => {
    let articleIds: Array<mongoose.Types.ObjectId> = req.body;
    let articles: Array<IArticle> = await articleUtils.getManyArticles(articleIds);
    return(requestService.sendResponse(res, "ok", 200, articles));
}