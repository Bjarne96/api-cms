import mongoose from "../initDb";
import { paymentApiSchema } from "../../schemas/payments"


const Payment = mongoose.model('payments', paymentApiSchema);

export default Payment;