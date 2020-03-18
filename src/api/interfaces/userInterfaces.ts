import * as mongoose from "mongoose";

//response from mongo db array within all found user
export interface IUserResponse extends Array<IUser>{}

//user with id
export interface IUser extends IDBUser {
    _id: mongoose.Types.ObjectId;
}
//user without id (for the methods)
export interface IDBUser {
    email: string;
    password: string;
    admin: Boolean;
}
