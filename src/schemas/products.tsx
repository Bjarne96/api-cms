import mongoose from "../api/initDb";
import { IDefaultSchema } from "./default"
import { IResource } from "./"

export interface IDependendProduct {
    _id: mongoose.Types.ObjectId,
    name: string,
    text: string,
    price: string,
    pictures: Array<mongoose.Types.ObjectId>,
    properties:  Array<Array<string>>
}

export interface IProduct {
    _id: mongoose.Types.ObjectId,
    name: string,
    text: string,
    price: string,
    pictures: Array<IResource>,
    properties: Array<Array<string>>
}

export interface IProperties{
    properties: Array<Array<string>>
}

//Empty Resource to load State
export let emptyWebProduct: IProduct = {
    _id: new mongoose.Types.ObjectId(),
    name: "",
    text: "",
    price: "",
    pictures: [],
    properties: []
}

export const productApiSchema = new mongoose.Schema({ 
    name: {type: String, required: true},
    text: {type: String, required: true},
    price: {type: Number, required: true},
    pictures: [{type: mongoose.Schema.Types.ObjectId, required: true}],
    properties: [
        [
            {type: String, required: true}
        ]
    ]
})


//Customer schema to render all necessary information in views and components
export const productWebSchema: IDefaultSchema = {
    formTitle: "Edit Products",
    tableTitle: "Products",
    fields: [
        {
            id: "_id",
            name: "",
            type: "text",
            required: false,
            error : "Missing ID.",
            hideInForm: true,
            hideInTable: true,
            checkErr : (field: string) => {return false}
        },
        {
            id: "name",
            name: "Name",
            type: "text",
            required: true,
            error : "Fill in product number please.",
            checkErr : (field: string) => {return false}
        },
        {
            id: "text",
            name: "Product Text",
            type: "tinymce",
            required: true,
            error : "Fill in product number please.",
            checkErr : (field: string) => {return false}
        },
        {
            id: "price",
            name: "Price",
            type: "number",
            required: false,
            error : "Fill in Last name please.",
            checkErr : (field: string) => {return false}
        },
        {
            id: "pictures",
            name: "Uploaded Pictures",
            type: "pictures",
            required: true,
            error : "Fill in Street name please.",
            checkErr : (field: string) => {return false}
        },
        {
            id: "properties",
            name: "Properties",
            type: "properties",
            required: true,
            error : "Fill in Street number please.",
            checkErr : (field: string) => {return false}
        }
    ]
}