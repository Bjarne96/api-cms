import { IArticle } from "./index";
import mongoose from "../api/initDb";
import { IProduct } from "./products";
//MongoDB Schema
export const backboneApiSchema = new mongoose.Schema({
    name: { type: String, required: true },
    domain: { type: String, required: true },
    articles: [
        { type: mongoose.Types.ObjectId, required: true }
    ],
    products: [
        { type: mongoose.Types.ObjectId, required: true }
    ],
    navigation: [{
        _id: false,
        name: { type: String, required: true },
        title: { type: String, required: true },
        url: { type: String, required: true },
        hide: { type: Boolean, required: false }
    }],
    footer: [
        {
            _id: false,
            category: { type: String, required: true },
            articles: [{ type: mongoose.Types.ObjectId, required: true }]
        }


    ],
});
// with loaded articles
export interface ILoadedBackbone {
    _id: mongoose.Types.ObjectId;
    name: string;
    domain: string;
    navigation: Array<INavItem>;
    products: Array<IProduct>;
    articles: Array<IArticle>;
    footer: Array<ILoadedFooter>;
}
export interface ILoadedFooter {
    category: string;
    articles: Array<IArticle>;
}

// without only the article ID
export interface IBackbone {
    _id: mongoose.Types.ObjectId;
    name: string;
    domain: string;
    articles: Array<string>;
    products: Array<string>;
    navigation: Array<INavItem>;
    footer: Array<IFooter>;
}

export interface IFooter {
    category: string;
    articles: Array<string>;
}

export interface INavItem {
    name: string;
    title: string;
    url: string;
    hide?: boolean;
}