import { Request } from "express"
import * as mongoose from "mongoose";

//todo compare to example
export interface IApiResponse {
    status: "ok" | "error";
    result: any;
}

export interface IApiResponseData extends IApiResponse{
    code:  200 | 400 | 403 | 404 | 500;
}

export interface IResponse {}

export interface IError{
    message: string;
    originalError: any;
    from: string;
}

export interface ILoginObject {
    email : string;
    password: string;
}
//utils return structure | todo implement
export interface IUtilReturn {
    status: "ok" | "error";
    result: any;
}
//jwt payload
export interface IJWTPayload {
    email: string;
    admin: Boolean;
}

//request handling for the session
export  interface ILoginRequest extends Request {
    body: ILoginObject;
}
//session To Encrypt object
export interface ISessionDecrypted {
    id: mongoose.Types.ObjectId;
    email: string;
}

//session param to update session
export interface ISessionParam {
    [index: string]: string;
}

export interface ISessionClientResponse {
    session: string;
    expires: string;
}

//session model specific interfaces 

//response from mongo db array within all found sessions
export interface ISessionResponse extends Array<ISession>{}

//session with id
export interface ISession extends IDBSession {
    _id: mongoose.Types.ObjectId;
}
//session without id (for the methods)
export interface IDBSession {
    email: string;
    expires: string;
}

export default ILoginRequest;