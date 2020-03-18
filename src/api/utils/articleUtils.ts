import Article from "../methods/article";
import * as mongoose from "mongoose"
import { IDependendArticle } from "../../schemas";

//GETs all Articles
export let getAllArticles = () => {
    return new Promise<Array<IDependendArticle>>( resolve => {
        Article.find((err: mongoose.Error, Article: Array<IDependendArticle>) => {
            if(err) {
                return resolve([]);//correct error handling
            } else {
                return resolve(Article);
            };
        })
    })
}