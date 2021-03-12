import mongoose from "../initDb";
import { backboneApiSchema } from "../../schemas/backbones"


const Backbone = mongoose.model('backbones', backboneApiSchema);

export default Backbone;