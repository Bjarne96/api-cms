import * as cryptoUtils from "../utils/cryptoUtils";
import * as userUtils from "../utils/userUtils";
import * as regexUtils from "../utils/regexUtils";
import * as messageUtils from "./../utils/messageUtils"

import * as requestService from "./requestServices";

import { IUserResponse, IUser, IDBUser } from "./../interfaces/userInterfaces";
import { UserModel } from "../methods/user";

//Posts a new User into the table if the email doesnt already exists
export let register = async (req, res) => {
    //validate email
    if (!regexUtils.regexEmail.test(req.body.email)) return (requestService.sendResponse(res, "error", 400, messageUtils.invalid.email));

    //request user by email
    let user: IUserResponse = await userUtils.getUserByParam(req.body.email, "email");

    //error if email exists
    if (user.length) return (requestService.sendResponse(res, "error", 400, messageUtils.registration.email));

    //pasword validation (regex) todo
    if (req.body.password.length === 0) return (requestService.sendResponse(res, "error", 400, messageUtils.auth[400]));

    //hashes password
    let hash: string = cryptoUtils.hashValue(req.body.password)

    //sets newuser
    let newUser: IDBUser = { email: req.body.email, password: hash, admin: false };

    //registers new user
    let resUser: UserModel = await userUtils.addUser(newUser);
    if (resUser === null) return (requestService.sendResponse(res, "error", 500, messageUtils.invalid.db));

    return (requestService.sendResponse(res, "ok", 200, resUser));
}

