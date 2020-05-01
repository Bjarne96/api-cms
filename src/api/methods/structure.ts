import mongoose from "../initDb";
import { structureApiSchema } from "../../schemas/structures"


const Structure = mongoose.model('structures', structureApiSchema);

export default Structure;