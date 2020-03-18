import * as mongoose from "mongoose";

let connect = async () => {
    await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (err: mongoose.Error) => {
        if(err){
            console.log("Mongo Error:", err.message);
        }else{
            console.log("Successfully connected to MongoDB");
        }
    });
}
connect();

export default mongoose;