import Product from "../methods/product";
import * as mongoose from "mongoose"
import { IDependendProduct } from "../../schemas";
//GET all Products
export let getAllProducts = () => {
    return new Promise<Array<IDependendProduct>>( resolve => {
        Product.find((err: mongoose.Error, products: Array<IDependendProduct>) => {
            if(err) {
                return resolve([]);//correct error handling
            } else {
                return resolve(products);
            };
        })
    });
}