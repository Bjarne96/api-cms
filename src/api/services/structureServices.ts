import * as structureUtils from "../utils/structureUtils";
import * as requestService from "./requestServices";
import * as messageUtils from "./../utils/messageUtils"
import { IDependendStructure, IStructure } from "../../schemas";

//Posts a new User into the table if the email doesnt already exists
export let loadStructures = async (req, res) => {
    let dependendStructures: Array<IDependendStructure> = await structureUtils.getAllStructures();
    let structures: Array<IStructure> = [];
    for(let i = 0; i < dependendStructures.length; i++) {
        let structure: IStructure = await structureUtils.loadIndependetStructure(dependendStructures[i])
        structures.push(structure);
    }
    //todo: Products
    return(requestService.sendResponse(res, "ok", 200, structures));
}

export let loadStructure = async (req, res) => {
    if(req.params.id == undefined) return(requestService.sendResponse(res, "ok", 200, messageUtils.invalid.id));
    let dependentStructure: IDependendStructure = await structureUtils.getStructure(req.params.id)
    let structure: IStructure = await structureUtils.loadIndependetStructure(dependentStructure);
    return(requestService.sendResponse(res, "ok", 200, structure));
}