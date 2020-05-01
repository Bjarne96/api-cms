import mongoose from "../api/initDb";
import { IDefaultSchema } from "./default"
import { IArticle, IProduct } from "."

export interface IStructure {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    domain: string;
    structure: Array<content>,
}

export interface content {
    _id: mongoose.Types.ObjectId,
    componentType: componentType,
    contentType: contentType,
    properties? : string //optional for styling or sets
}

export interface IDependendStructure {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    domain: string;
    structure: Array<dependendContent>,
}

export type componentType = "set" |  "widescreen"| "productdetail";

export type contentType =  "article" | "product";

export interface dependendContent {
    content: IArticle | IProduct,
    componentType : componentType,
    contentType : contentType,
    properties? : string //optional for styling or sets
}
   

export const structureApiSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    domain: {type: String, required: true},
    structure: [{
        _id: {type: mongoose.Types.ObjectId, required: true},
        componentType: {type: String, required: true},
        contentType: {type: String, required: true}}
    ],
});


//Empty Article to load State
export let emptyWebStructure = {
    _id: new mongoose.Types.ObjectId(),
    name: "",
    title: "",
    content: "",
    url: "",
    pictures: []
}

export const articleWebSchema: IDefaultSchema = {
    formTitle: "Edit Article",
    tableTitle: "Articles",
    fields: [
        {
            id: "_id",
            name: "",
            type: "text",
            required: false,
            error : "Missing ID.",
            hideInForm: true,
            hideInTable: true,
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "name",
            name: "Name",
            type: "text",
            required: true,
            error : "Missing ID.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "title",
            name: "Title",
            type: "text",
            required: true,
            error : "Missing ID.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "url",
            name: "URL",
            type: "text",
            required: true,
            error : "Missing ID.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "pictures",
            name: "Pictures",
            type: "pictures",
            required: false,
            error : "Missing ID.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "content",
            name: "Content",
            type: "tinymce",
            required: true,
            error : "Missing ID.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        }
        
    ]
}

export default structureApiSchema;