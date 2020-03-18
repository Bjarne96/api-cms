import mongoose from "../initDb";
import { invoiceApiSchema } from "./../../schemas/invoices"

const Invoice = mongoose.model('invoices', invoiceApiSchema);

export default Invoice;