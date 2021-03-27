import * as mongoose from "mongoose";
import config = require('./../../config')

const properties = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}

let connect = async () => {
    await mongoose.connect(config.mongo_uri, properties, (err: mongoose.Error) => {
        if (err) {
            console.log("Mongo Error:", err.message);
        } else {
            console.log("Successfully connected to MongoDB");
        }
    });
}
connect();

export default mongoose;