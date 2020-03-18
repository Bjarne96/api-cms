import mongoose from "../api/initDb";
import { IDefaultSchema } from "./default"
import { IResource } from "./"

export interface IDependendArticle {
    _id: mongoose.Types.ObjectId;
    name: string;
    title: string;
    content: string;
    url: string;
    pictures: Array<mongoose.Types.ObjectId>,
}

export interface IArticle {
    _id: mongoose.Types.ObjectId;
    name: string;
    title: string;
    content: string;
    url: string;
    pictures: Array<IResource>,
}

export const articleApiSchema = new mongoose.Schema({
    name: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    url: {type: String, required: true},
    pictures: [{type: mongoose.Schema.Types.ObjectId, required: true}],
});


//Empty Article to load State
export let emptyWebArticle = {
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

export default articleApiSchema;