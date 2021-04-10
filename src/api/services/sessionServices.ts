import { Request, Response } from 'express';

import { ILoginRequest, IUtilReturn } from "./../interfaces/sessionInterfaces";
import { IUserResponse } from "./../interfaces/userInterfaces";
import * as cryptoUtils from "./../utils/cryptoUtils"
import * as userUtils from "./../utils/userUtils"
import * as messageUtils from "./../utils/messageUtils"
import * as requestService from "./requestServices";


//loggs in the 
export let login = async (req: ILoginRequest, res: Response) => {

    //todo validate body object
    const { email, password } = req.body;

    //request user by email
    let user: IUserResponse = await userUtils.getUserByParam(email, "email");

    //if user is empty there is no matching email
    if (!user.length) return (requestService.sendResponse(res, "error", 401, messageUtils.login.email));

    //if hash returns false the password doesnt match
    if (!cryptoUtils.compareHash(password, user[0].password)) {
        return (requestService.sendResponse(res, "error", 401, messageUtils.login.password))
    }
    //Creates payload data
    let jwtPayload = { email: email, admin: user[0].admin };

    //creates new Token
    let newToken = await cryptoUtils.createToken(jwtPayload);

    //sets new Token in header
    res.set('Authorization', "Bearer " + newToken);

    //sends encrypted session
    return (requestService.sendResponse(res, "ok", 200, jwtPayload));
}

//valdiates the request and refreshes the token
export let validate = async (req: Request, res: Response, next) => {

    //validates -> todo any interface
    let verifyResponse: IUtilReturn = await cryptoUtils.verifyToken(req.headers['authorization']);

    //sends response if authentication failed
    if (verifyResponse.status == "error") {
        //ends the request because of an invalid token
        await requestService.sendResponse(res, verifyResponse.status, 403, verifyResponse.result);
        return;
    }

    //request user by email
    let user: IUserResponse = await userUtils.getUserByParam(verifyResponse.result.email, "email");

    //Creates payload data
    let jwtPayload = { email: verifyResponse.result.email, admin: user[0].admin };

    //creates new Token
    let newToken = await cryptoUtils.createToken(jwtPayload);

    //sets new Token in header
    res.set('Authorization', "Bearer " + newToken);

    //returns next to handle the valid request by next handler
    return (next());
}

//valdiates the request and refreshes the token
export let validateAdmin = async (req: Request, res: Response, next) => {

    //validates -> todo any interface
    let verifyResponse: IUtilReturn = await cryptoUtils.verifyToken(req.headers['authorization']);

    //sends response if user has no admin
    if (!verifyResponse.result.admin) {
        //ends the request because of missing permission
        await requestService.sendResponse(res, verifyResponse.status, 403, verifyResponse.result);
        return;
    }

    //returns next to handle the valid request by next handler
    return (next());
}