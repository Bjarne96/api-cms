import * as mongoose from "mongoose";
import config = require('./../../config')

let connect = async () => {
    await mongoose.connect(config.mongo_uri, { useNewUrlParser: true }, (err: mongoose.Error) => {
        if (err) {
            console.log("Mongo Error:", err.message);
        } else {
            console.log("Successfully connected to MongoDB");
        }
    });
}
connect();

export default mongoose;