import Structure from "../methods/structure";
import * as mongoose from "mongoose"
import { IDependendStructure } from "../../schemas";

//GETs all Structures
export let getAllStructures = () => {
    return new Promise<Array<IDependendStructure>>( resolve => {
        Structure.find((err: mongoose.Error, Structure: Array<IDependendStructure>) => {
            if(err) {
                return resolve([]);//correct error handling
            } else {
                return resolve(Structure);
            };
        })
    })
}