import * as mongoose from "mongoose";

const db: string = "mongodb://127.0.0.1:27017/schurwolldecken";
let connect = async () => {
    await mongoose.connect(db, {authSource: "admin", user: process.env.MONGO_USERNAME, pass: process.env.MONGO_PASSWORD }, (err: mongoose.Error) => {
        if(err){
            console.log("Mongo Error:", err.message);
        }else{
            console.log("Successfully connected to MongoDB");
        }
    });
}
connect();

export default mongoose;