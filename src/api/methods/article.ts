import mongoose from "../initDb";
import { articleApiSchema } from "./../../schemas/articles"


const Article = mongoose.model('articles', articleApiSchema);

export default Article;