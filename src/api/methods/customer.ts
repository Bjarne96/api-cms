import mongoose from "../initDb";
import { customerApiSchema } from "./../../schemas/customers"

const Customer = mongoose.model('customers', customerApiSchema);

export default Customer;