import mongoose from "../api/initDb";

export interface IDependendArticle {
    _id: mongoose.Types.ObjectId;
    name: string;
    title: string;
    content: string;
    url: string;
}

export interface IArticle {
    _id: mongoose.Types.ObjectId;
    name: string;
    title: string;
    content: string;
    url: string;
}

export const articleApiSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    url: { type: String, required: true }
});

export default articleApiSchema;