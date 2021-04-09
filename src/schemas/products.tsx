import mongoose from "../api/initDb";

//Every variant is unique for one combination from the noth selectors
export interface IProduct {
    _id: mongoose.Types.ObjectId,
    name: string,
    sku: string,
    variants: [{
        selector_1: { type: Number, required: true },
        selector_2: { type: Number, required: true },
        pictures: Array<string>,
        price: Number,
        description: string,
    }],
    properties: Array<Array<{ name: string, id: Number }>>
}

export interface IProductVariant {
    selector_1: number,
    selector_2: number,
    pictures: Array<string>,
    price: number,
    description: string,
}

export interface IProductSelected {
    _id: string,
    name: string,
    sku: string,
    variant: IProductVariant,
    properties: Array<Array<{ name: string, id: number }>>
    count: number;
    total: number;
}

export const productApiSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true },
    variants: [{
        _id: false,
        selector_1: { type: Number, required: true },
        selector_2: { type: Number, required: true },
        pictures: [{ type: String, required: true }],
        price: { type: Number, required: true },
        description: { type: String, required: true }
    }],
    properties: [[
        {
            _id: false,
            name: { type: String, required: true },
            id: { type: Number, required: true }
        }
    ]]
})