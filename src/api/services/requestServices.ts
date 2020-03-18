import { Response } from "express";
import { IApiResponse }  from "./../interfaces/sessionInterfaces";

export let sendResponse = (res: Response, status: "ok" | "error", code: 200 | 400 | 401 | 403 | 404 | 500, result: any) => {
    let apiAnswer: IApiResponse = {status: status, result: result}
    return(res.status(code).send(apiAnswer));
}
/*
res.sendStatus(200) // equivalent to res.status(200).send('OK')
res.sendStatus(400) // equivalent to res.status(400).send('Bad Request')
res.sendStatus(403) // equivalent to res.status(403).send('Forbidden')
res.sendStatus(404) // equivalent to res.status(404).send('Not Found')
res.sendStatus(500) // equivalent to res.status(500).send('Internal Server Error')
*/