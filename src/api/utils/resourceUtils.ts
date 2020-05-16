
import Resource from "../methods/resource";
import * as mongoose from "mongoose";
import { IResource } from "../../schemas";


export let getManyResources = (ids: Array<mongoose.Types.ObjectId>) => {
    return new Promise<Array<IResource>>( resolve => {
        let newArray = [];
        for(let i = 0; i < ids.length; i++) {
            newArray.push(ids[i])
    }
        let searchparam = {'_id': { $in: newArray}}
        Resource.find(searchparam, (err: mongoose.Error, resources: Array<IResource>) => {
            if(err) {
                resolve([]);//proper erro handling
            } else {
                resolve(resources);
            };
        })
    })
}