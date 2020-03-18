import mongoose from "../api/initDb";
import { IDefaultSchema } from "./default"

export interface IResource {
    _id: mongoose.Types.ObjectId;
    name: string;
    path: string;
}

export const resourceApiSchema = new mongoose.Schema({
    name: {type: String, required: true},
    path: {type: String, required: true}
});


//Empty Resource to load State
export let emptyWebResource = {
    _id: new mongoose.Types.ObjectId(),
    name: "",
    path: ""
}

export const resourceWebSchema: IDefaultSchema = {
    formTitle: "Edit Resource",
    tableTitle: "Resources",
    fields: [
        {
            id: "_id",
            name: "",
            type: "text",
            required: false,
            error : "Missing ID.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "_id",
            name: "",
            type: "text",
            required: false,
            error : "Missing ID.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "path",
            name: "Path",
            type: "text",
            required: true,
            error : "Missing ID.",
            //hideInForm: true,
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        }
    ]
}

export default resourceApiSchema;