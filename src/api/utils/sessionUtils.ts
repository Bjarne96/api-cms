import Session from "../methods/Session";
import * as mongoose from "mongoose";
import moment = require('moment');
import { ISession, ISessionResponse, IDBSession, ISessionParam } from "./../interfaces/sessionInterfaces"

//GET session by id
export let getSessionById = (value: mongoose.Types.ObjectId) => {
    return new Promise<ISession>(resolve => {
        //checks session id is valid
        if(!mongoose.Types.ObjectId.isValid(value)){
            resolve(null);
        }
        Session.findById(value, (err: mongoose.Error, session: ISession) => {
            if (err) {
                console.log("err", err);
                resolve(null);
                
            } else {
                resolve(session)
            };
        })
    })
}
//get a Session by the given param
export let getSessionByParam = (param: string, value: string) => {
    return new Promise<ISessionResponse>(resolve => {
        const query = {};
        query[param] = value;
        let update_session = new Session(query);
        Session.find(update_session, (err: mongoose.Error, session: ISessionResponse) => {
            if (err) {
                console.log("err", err)
                resolve([]);
            } else {
                resolve(session)
            };
        })
    })
}
//adds session in database
export let addSession = (session: IDBSession) => {
    return new Promise<ISession>(resolve => {
        let new_session = new Session(session);
        new_session.save((err: mongoose.Error, session: ISession) => {   
            if (err) {
                console.log("err", err)
                resolve(null);
            } else {
                resolve(session);
            }
        })
    })
}
//updates session
export let updateSessionByParam = async (session: ISession) => {
    return new Promise<ISession>(async (resolve) => {
        //sets new expiry date (formatted to string)
        let newExpiryDate = moment(new Date()).add('5', 'minutes').toString();  
        let newSession: ISession  = await updateSessionById(session._id, {expires: newExpiryDate})
        //return new session
        resolve(newSession);
    })
}
//updates session by id and updates object {key: value}
export let updateSessionById = (id: mongoose.Types.ObjectId, updateData: ISessionParam) => {
    return new Promise<ISession>(resolve => {
        //checks if id is valid
        if(!mongoose.Types.ObjectId.isValid(id)){
            resolve(null);
        }
        Session.findByIdAndUpdate(id, updateData, (err: mongoose.Error, session: ISession) => {
            if (err) {
                resolve(null);
            } else {
                resolve(session);
            }
        })
    })
}
//deletes session by id
export let deleteSession = (id: mongoose.Types.ObjectId) => {
    return new Promise<boolean>(resolve => {
        Session.deleteOne({_id : id}, (err: mongoose.Error) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}