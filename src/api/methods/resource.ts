import mongoose from "../initDb";

export const resourceSchema = new mongoose.Schema({ 
    name: {type: String, required: true},
    path: {type: String, required: true},
});

const Resource = mongoose.model('resources', resourceSchema);

export default Resource;