import Structure from "../methods/structure";
import * as articleUtils from "../utils/articleUtils";
import * as mongoose from "mongoose"
import { IDependendStructure, IContent, IStructure } from "../../schemas";

//GETs all Structures
export let getAllStructures = () => {
    return new Promise<Array<IDependendStructure>>( resolve => {
        Structure.find((err: mongoose.Error, Structure: Array<IDependendStructure>) => {
            if(err) {
                return resolve([]);//correct error handling
            } else {
                return resolve(Structure);
            };
        })
    })
}

export let loadIndependetStructure = async (dependentStructure: IDependendStructure) => {
    let structure: IStructure = {
        _id : dependentStructure._id,
        name: dependentStructure.name,
        description: dependentStructure.description,
        domain: dependentStructure.domain,
        content: []
    }
    let articleIds = [];
    let productIds = [];
    let content = dependentStructure.content;
    if(content.length) {
        for(let j = 0; j < content.length; j++) {
            if(content[j].contentType == "article"){
                articleIds.push(content[j]._id)
            }
            if(content[j].contentType == "product") {
                productIds.push(content[j]._id)
            }
        }
        let articles = await articleUtils.getManyArticles(articleIds);
        for(let y = 0; y < content.length; y++) {
            let contentArticle = content[y];
            let properties = "";
            if(contentArticle.properties != undefined) {
                properties = contentArticle.properties;
            }
            let newContent: IContent = {
                content : null,
                contentType : contentArticle.contentType,
                componentType : contentArticle.componentType,
                properties : properties
            };
            //make product usable - todo
            //if(contentArticle.contentType === "article") {
                for(let x = 0; x < articles.length; x++) {
                    if(contentArticle._id.toString() == articles[x]._id.toString()) {
                        newContent.content = articles[x];
                        structure.content.push(newContent);
                    }
                }
            //}
        }
        return(structure);
    }
}

//GETs -> one Structure
export let getStructure = (id) => {
    return new Promise<IDependendStructure>( resolve => {
        Structure.findById(id, (err: mongoose.Error, Structure: IDependendStructure) => {
            if(err) {
                console.log("err", err)
                return resolve(null);
            } else {
                return resolve(Structure);
            };
        })
    })
}