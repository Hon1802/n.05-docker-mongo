import { ObjectId } from "bson";
import mongoose, { Schema } from "mongoose";
export default mongoose.model('Tour',
    new Schema({
        id:{type: ObjectId},
        name:{
            type:String,
            required:true,
            validate:{
                validator:(value) =>value.length>3,
                message:'User name must at least 3 characters'
            }
        },
        description:{
            type:String,
            required:true        
        },
        destination:{
            type:String,
            required:true        
        },
        region:{
            type:String,
            required:true        
        },
        category:{
            type:String,
            required:true        
        },
        duration:{
            type: Number,
            required:true        
        },
        originalPrice:{
            type: Number,
            required:true        
        },
        childPrice:{
            type: Number,
            required:true        
        },
        adultPrice:{
            type: Number,
            required:true        
        },
        urlImageN1:{
            type:String
        },
        urlImageN2:{
            type:String
        },
        urlImageN3:{
            type:String
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