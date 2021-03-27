import { Request, Response } from "express";
import Backbone from "../methods/backbone";
import * as mongoose from "mongoose";
import * as requestService from "../services/requestServices";
import * as articleController from "./articleController";
import * as productController from "./productController";
import * as messageUtils from "./../utils/messageUtils"
import { IBackbone, ILoadedBackbone, IArticle, IProduct, ILoadedFooter } from "../../schemas";

//GET all Backbones
export let getAllBackbones = (req: Request, res: Response) => {
    Backbone.find((err: mongoose.Error, backbones: any) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, backbones)
        };
    })
}

//GETs -> one Backbone
export let getBackbone = (req: Request, res: Response) => {
    Backbone.findById(req.params.id, (err: mongoose.Error, backbone: IBackbone) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, backbone)
        };
    })
}

//PUTs -> an new Backbone into the table
export let addBackbone = (req: Request, res: Response) => {
    if (req.body == undefined) {
        return (requestService.sendResponse(res, "error", 500, messageUtils.invalid.object));
    }
    let addBackbone = new Backbone(req.body);
    addBackbone.save((err: mongoose.Error) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            requestService.sendResponse(res, "ok", 200, addBackbone)
        };
    })
}

//DELETEs an Backbone
export let deleteBackbone = (req: Request, res: Response) => {
    Backbone.deleteOne({ _id: req.params.id })
        .then((data) => {
            requestService.sendResponse(res, "ok", 200, req.params.id)
        })
        .catch((err) => {
            requestService.sendResponse(res, "error", 500, err)
        })
}

//POST -> Updates an Backbone
export let updateBackbone = (req: Request, res: Response) => {
    Backbone.findByIdAndUpdate(req.params.id, req.body, (err: mongoose.Error) => {
        if (err) {
            requestService.sendResponse(res, "error", 500, err)
        } else {
            getBackbone(req, res);
        };
    })
}
//todo
//GET all Backbones
export let getAllBackbonesArray = () => {
    Backbone.find((err: mongoose.Error, backbones: any) => {
        if (err) {
            return err;
        } else {
            return backbones;
        };
    })
}

export let getLoadedBackbone = async (req: Request, res: Response) => {
    //load requested backbone
    let backbone: any = await Backbone.findById(req.params.id, (err: mongoose.Error, dbbackbone: IBackbone) => {
        if (err) {
            console.log('err', err);
        } else {
            backbone = dbbackbone;
        };
    })

    //loadedBackbone with empty Arrays
    let loadedBackbone: ILoadedBackbone = {
        _id: backbone._id,
        name: backbone.name,
        domain: backbone.domain,
        articles: [],
        products: [],
        navigation: backbone.navigation,
        footer: []
    }

    // collect all Ids
    let articleIds = [];
    let footerIds = [];
    let productIds = [];

    //pushes all article ids
    for (let i = 0; i < backbone.articles.length; i++) {
        articleIds.push(backbone.articles[i])
    }
    //pushes all footer article ids
    for (let i = 0; i < backbone.footer.length; i++) {
        for (let j = 0; j < backbone.footer[i].articles.length; j++) {
            footerIds.push(backbone.footer[i].articles[j])
        }
    }
    //pushes all product ids
    for (let i = 0; i < backbone.products.length; i++) {
        productIds.push(backbone.products[i])
    }
    let articles: Array<IArticle>;
    let footerArticles: Array<IArticle>;
    let products: Array<IProduct>;

    //load all articles
    if (articleIds.length) articles = await articleController.getManyArticles(articleIds);
    if (footerIds.length) footerArticles = await articleController.getManyArticles(footerIds);
    if (productIds.length) products = await productController.getManyProducts(productIds);

    //Loop through old backbone articles and push articles in the correct order to the loadedBackbone
    if (backbone.articles.length) {
        for (let i = 0; i < backbone.articles.length; i++) {
            for (let j = 0; j < articles.length; j++) {
                if (backbone.articles[i].toString() == articles[j]._id.toString()) {
                    loadedBackbone.articles.push(articles[j]);
                    continue;
                }
            }
        }
    }


    //Loop through old backbone products and push articles in the correct order to the loadedBackbone
    if (backbone.products.length) {
        for (let i = 0; i < backbone.products.length; i++) {
            for (let j = 0; j < products.length; j++) {
                if (backbone.products[i].toString() == products[j]._id.toString()) {
                    loadedBackbone.products.push(products[j]);
                    continue;
                }
            }
        }
    }
    //Loop through old backbone articles and push articles in the correct order to the loadedBackbone
    //Temporary Footer
    let footer: Array<ILoadedFooter> = [];
    if (backbone.footer.length) {
        //loop categories
        for (let x = 0; x < backbone.footer.length; x++) {
            let newFooterObj: ILoadedFooter = {
                category: backbone.footer[x].category,
                articles: []
            }
            //loop article Ids in category
            for (let i = 0; i < backbone.footer[x].articles.length; i++) {
                for (let j = 0; j < footerArticles.length; j++) {
                    if (backbone.footer[x].articles[i].toString() == footerArticles[j]._id.toString()) {
                        newFooterObj.articles.push(footerArticles[j]);
                        continue;
                    }
                }
            }
            footer.push(newFooterObj)
        }
    }
    loadedBackbone.footer = footer;
    return (requestService.sendResponse(res, "ok", 200, loadedBackbone));
}

export default getBackbone;
