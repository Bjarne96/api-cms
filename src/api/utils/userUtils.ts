import User from "../methods/user";
import { IUserResponse, IUser, IDBUser }  from "./../interfaces/userInterfaces";
import mongoose from "../initDb";

//get a User by the given param
export let getUserByParam = (value: String, param: string) => {
    return new Promise<IUserResponse>(resolve => {
        const query = {};
        query[param] = value;
        User.find(query, (err: mongoose.Error, user: IUserResponse) => {
            if (err) {
                console.log("err", err)
                resolve([]);
            } else {
                resolve(user)
            };
        })
    })
    
}

//adds User
export let addUser = (user: IDBUser) => {
    return new Promise<IUser>(resolve => {
        let addUser = new User(user);
        addUser.save(async (err: mongoose.Error, user: IUser) => {
            if (err) {
                console.log("err", err);
                resolve(null)
            } else {
                resolve(user);
            }
        })
    })
}