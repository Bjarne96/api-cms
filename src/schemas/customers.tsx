import mongoose from "./../api/initDb";

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
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    //identifies the valid/newest customer data to the account
    date_created: { type: String, required: true },
    //customer data
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    gender: { type: String, required: true },
    address_street: { type: String, required: true },
    address_street_number: { type: String, required: true },
    address_zipcode: { type: String, required: false },
    address_city: { type: String, required: false }
})

export default customerApiSchema;