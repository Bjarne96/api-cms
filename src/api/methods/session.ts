import mongoose from "../initDb";
import { IDBSession }  from "./../interfaces/sessionInterfaces";

interface SessionModel extends mongoose.Document, IDBSession {}

let sessionSchema = new mongoose.Schema({
    email: {type: String, required: true},
    expires: {type: String, required: true}
}); 

export default mongoose.model<SessionModel>('sessions', sessionSchema);