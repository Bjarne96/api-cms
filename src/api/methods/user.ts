import mongoose from "../initDb";
import { IDBUser }  from "./../interfaces/userInterfaces";

export interface UserModel extends mongoose.Document, IDBUser {}

let userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    admin: {type: Boolean, required: true}
}); 

export default mongoose.model<UserModel>('users', userSchema);