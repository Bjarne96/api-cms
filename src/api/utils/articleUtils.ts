import Article from "../methods/article";
import * as mongoose from "mongoose"
import { IDependendArticle, IArticle } from "../../schemas";
import * as resourceUtils from "./resourceUtils"

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

export let getManyArticles = (articleIds: Array<mongoose.Types.ObjectId>) => {
    return new Promise<Array<IArticle>>(async resolve => {
        let articles: Array<IDependendArticle> = await getManyDependentArticles(articleIds);
        let newArray:any = articles;
        let newArticles: Array<IArticle> = [];
        for(let i = 0; i < articles.length; i++) {
            let articlePictures = articles[i].pictures;
            if(articlePictures.length) {
                let pictures = await resourceUtils.getManyResources(articlePictures);
                //console.log('pictures', pictures);
                for(let j = 0; j < pictures.length; j++) {
                    newArray[i].pictures[j] = pictures[j];
                }
            };
            await newArticles.push(newArray[i]);
        }
        resolve(newArticles)
    })
}

export let getManyDependentArticles = (Ids: Array<mongoose.Types.ObjectId>) => {
    return new Promise<Array<IDependendArticle>>( resolve => {
        let newArray = [];
        for(let i = 0; i < Ids.length; i++) {
            newArray.push(Ids[i])
        }
        let searchparam = {'_id': { $in: newArray}}
        Article.find(
            searchparam, (err: mongoose.Error, articles: Array<IDependendArticle>) => {
            if(err) {
                console.log('err', err);
                resolve([]);//correct error handling
            } else {
                resolve(articles);
            };
        })
    })
}