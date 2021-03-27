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

import { Document, Model } from "mongoose";
export interface IUser {
    firstName: string;
    lastName: string;
    age: number;
    dateOfEntry?: Date;
    lastUpdated?: Date;
}
export interface IUserDocument extends IUser, Document { }
export interface IUserModel extends Model<IUserDocument> { }

export default articleApiSchema;