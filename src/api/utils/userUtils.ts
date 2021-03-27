import User, { UserModel } from "../methods/user";
import { IUserResponse, IDBUser } from "./../interfaces/userInterfaces";
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
    return new Promise<UserModel>(resolve => {
        let addUser = new User(user);
        addUser.save()
            .then((user) => {
                resolve(user);
            })
            .catch((err) => {
                resolve(null)
            });
    })
}