import { ObjectId } from "bson";
import mongoose, { Schema } from "mongoose";
export default mongoose.model('Product',
    new Schema({
        id:{type: ObjectId},
        budget:{
            type: "double",
            required:true        
        },
        idTour:{
            type: "ObjectId",
            required:true        
        },
        idUser:{
            type: "ObjectId",
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
        departureTime:{
            type: Date,
            required:true        
        },        
        returnTime:{
            type:Date,
            required:true        
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