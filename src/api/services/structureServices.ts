import * as structureUtils from "../utils/structureUtils";
import * as articleUtils from "../utils/articleUtils";
import * as requestService from "./requestServices";
import { IDependendStructure, IStructure, IContent } from "../../schemas";

//Posts a new User into the table if the email doesnt already exists
export let loadStructures = async (req, res) => {
    let dependendStructures: Array<IDependendStructure> = await structureUtils.getAllStructures();
    let structures: Array<IStructure> = [];
    let newArticles:any = dependendStructures;
    let articleIds = [];
    let productIds = [];
    for(let i = 0; i < dependendStructures.length; i++) {
        let content = dependendStructures[i].content;
        let dependentStructure = dependendStructures[i];
        let structure: IStructure = {
            _id : dependentStructure._id,
            name: dependentStructure.name,
            description: dependentStructure.description,
            domain: dependentStructure.domain,
            content: []
        }
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
                let newContent: IContent = {
                    content : null,
                    contentType : contentArticle.contentType,
                    componentType : contentArticle.componentType
                };
                if(contentArticle.contentType === "article") {
                    for(let x = 0; x < articles.length; x++) {
                        if(contentArticle._id.toString() == articles[x]._id.toString()) {
                            newContent.content = articles[x];
                            structure.content.push(newContent);
                        }
                    }
                }
            }
        }
        structures.push(structure);
    }
    //todo: Products
    return(requestService.sendResponse(res, "ok", 200, structures));
}