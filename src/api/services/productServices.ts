import * as resourceUtils from "../utils/resourceUtils"
import * as productUtils from "../utils/productUtils"
import * as requestService from "./requestServices";
import { IDependendProduct } from "../../schemas";

//Posts a new User into the table if the email doesnt already exists
export let loadProducts = async (req, res) => {
    let products: Array<IDependendProduct> = await productUtils.getAllProducts();
    let newProducts:any = products;
    for(let i = 0; i < products.length; i++) {
        let productPictures = products[i].pictures;
        if(!productPictures.length) continue;
        let pictures = await resourceUtils.getManyResources(productPictures);
        for(let j = 0; j < pictures.length; j++) {
            newProducts[i].pictures[j] = pictures[j];
        }
    }
    return(requestService.sendResponse(res, "ok", 200, newProducts));
}