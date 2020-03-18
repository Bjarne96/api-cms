import * as resourceUtils from "../utils/resourceUtils";
import * as articleUtils from "../utils/articleUtils";
import * as requestService from "./requestServices";
import { IDependendArticle } from "../../schemas";

//Posts a new User into the table if the email doesnt already exists
export let loadArticles = async (req, res) => {
    let articles: Array<IDependendArticle> = await articleUtils.getAllArticles();
    let newArticles:any = articles;
    for(let i = 0; i < articles.length; i++) {
        let articlePictures = articles[i].pictures;
        if(!articlePictures.length) continue;
        let pictures = await resourceUtils.getManyResources(articlePictures);
        for(let j = 0; j < pictures.length; j++) {
            newArticles[i].pictures[j] = pictures[j];
        }
    }
    return(requestService.sendResponse(res, "ok", 200, newArticles));
}