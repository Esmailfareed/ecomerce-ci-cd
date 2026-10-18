import mongoose from "mongoose";
import { seed } from "./seed.js";


export function dbConnection(){
 mongoose.connect(process.env.DB_ONLINE || "mongodb://127.0.0.1:27017/ecommerce").then(()=>{
    console.log("DB Connected");
    return seed();
}).catch((err)=>{
    console.log("err",err);
})
}
