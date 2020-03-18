import mongoose from "../initDb";
import { productApiSchema } from "./../../schemas/products"

const Product = mongoose.model('products', productApiSchema);

export default Product;