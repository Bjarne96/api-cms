import mongoose from "./../api/initDb";
import { IDefaultSchema } from "./default"

//Customer Databaseobject
export interface ICustomer {
    _id: mongoose.Types.ObjectId,
    date_created: string,
    user_id: string,
    lastname: string,
    firstname: string,
    address_street_name: string,
    address_street_number: string,
    address_city: string,
    address_zipcode: string,
    gender: string
}

export const customerApiSchema = new mongoose.Schema({ 
    user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    //identifies the valid/newest customer data to the account
    date_created: {type: String, required: true},
    //customer data
    lastname: {type: String, required: true},
    firstname: {type: String, required: true},
    gender: {type:  String , required: true},
    address_street: {type: String, required: true},
    address_street_number: {type: String, required: true},
    address_zipcode: {type: String, required: false},
    address_city: {type: String, required: false}
})

//Empty Customer to load State
export let  emptyWebCustomer = {
    _id: new mongoose.Types.ObjectId(),
    date_created: "",
    user_id: "",
    lastname: "",
    firstname: "",
    address_street_name: "",
    address_street_number: "",
    address_city: "",
    address_zipcode: "",
    gender: ""
}

//Customer schema to render all necessary information in views and components
export const customerWebSchema: IDefaultSchema = {
    formTitle: "Edit Customer",
    tableTitle: "Customers",
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
            id: "lastname",
            name: "Last name",
            type: "text",
            required: true,
            error : "Fill in Last name please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "firstname",
            name: "First name",
            type: "text",
            required: true,
            error : "Fill in First name please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "user_id",
            name: "User ID",
            type: "text",
            required: false,
            error : "",
            hideInForm: true,
            hideInTable: true,
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "date_created",
            name: "Date Created",
            type: "text",
            required: false,
            error : "Fill in Last name please.",
            hideInForm: true,
            hideInTable: true,
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "address_street",
            name: "Street name",
            type: "text",
            required: true,
            error : "Fill in Street name please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "address_street_number",
            name: "Street number",
            type: "text",
            required: true,
            error : "Fill in Street number please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "address_city",
            name: "City",
            type: "text",
            required: true,
            error : "Fill in City please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "address_zipcode",
            name: "Zipcode",
            type: "text",
            required: true,
            error : "Fill in Zipcode please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        },
        {
            id: "gender",
            name: "Gender",
            type: "text",
            required: true,
            error : "Fill in Gender please.",
            checkErr : (field: string) => {if(field.length) return false; else{return true}}
        }
    ]
}

export default customerApiSchema;