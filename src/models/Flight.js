import { ObjectId } from "bson";
import mongoose, { Schema } from "mongoose";
export default mongoose.model('Flight',
    new Schema({
        id:{type: ObjectId},
        airport:{
            type: String,      
        },
        code_flight:{
            type: String,
            required:true        
        },        
        district:{
            type: String,
            required:true        
        },
        include_district:{
            type: String,       
        },
        status:{
            type:String,
            required:true        
        }
    },{
        autoCreate: false,
        autoIndex: true
    })
)