import config = require('./../../../config');
import jwt = require('jsonwebtoken');
import * as messageUtils from "./../utils/messageUtils";
import { IUtilReturn, IJWTPayload } from "./../interfaces/sessionInterfaces";

//crypto functions
export let createToken = async (payload: IJWTPayload) => {
    return new Promise<string>(resolve => {
        //Set options for JWT
        const options = { expiresIn: config.jwt_expiry, issuer: 'https://localhost' };
        //sets token
        const token = jwt.sign(payload, config.jwt_secret, options);
        //returns token
        resolve(token);
    })
}

export let verifyToken = async (bearerHeader) => {

    return new Promise<IUtilReturn>(resolve => {

        //Checks header
        if (bearerHeader === undefined) resolve({ status: "error", result: messageUtils.auth[403] })

        //Splits up into the token and the bearer
        const bearer = bearerHeader.split(' ');

        //Sets the token
        const token = bearer[1];

        //Verfiys the token
        jwt.verify(token, config.jwt_secret, (err, decryptedToken) => {

            //Returns jwt error or expired token as error
            if (err || decryptedToken.status === "error") {

                //Sets default error message
                let errMessage = messageUtils.auth[403];
                if (err.name === "TokenExpiredError") {

                    //Sets expired message
                    errMessage = messageUtils.login.expired;
                }
                //Resolves error
                resolve({ status: "error", result: errMessage })
            }

            //Resolves valid token
            resolve({ status: "ok", result: decryptedToken });
        })
    })
}
// import bcrypt = require('bcrypt');
// import crypto = require('crypto');
// //decrypts string -> ToDo Decrypt + validating object
// export let decrypt = async (value) => {
//     //todo: string validation
//     return new Promise<string>(resolve => {
//         let decipher = crypto.createDecipher(config.bcrypt_algorithm, config.bcrypt_password)
//         let dec: string = decipher.update(value, 'hex', 'utf8')
//         dec += decipher.final('utf8');
//         resolve(dec);
//     })
// }
// //encrypts string
// export let encrypt = (value: string) => {
//     return new Promise<string>(resolve => {
//         var cipher = crypto.createCipher(config.bcrypt_algorithm, config.bcrypt_password)
//         var crypted: string = cipher.update(value, 'utf8', 'hex')
//         crypted += cipher.final('hex');
//         resolve(crypted);
//     })
// }

// //bycrypt functions

// //hashes value
// export let hashValue = (value: string) => {
//     return (bcrypt.hashSync(value, config.bcrypt_saltrounds));
// }
// //compares hash values and returns true if value matches hash
// export let compareHash = (value: string, hash: string) => {
//     return (bcrypt.compareSync(value, hash));
// }
