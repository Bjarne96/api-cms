import mongoose from "../api/initDb";

export interface IPayment {
    invoiceno: Number;
    paymentid: String;
}

export const paymentApiSchema = new mongoose.Schema({
    invoiceno: { type: Number, required: true },
    paymentid: { type: String, required: true },
});

export default paymentApiSchema;