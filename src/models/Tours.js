import { ObjectId } from "bson";
import { utcToZonedTime } from 'date-fns-tz'
// Lấy thời gian hiện tại và chuyển về múi giờ mong muốn
const now = new Date();

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
        districtDes:{
            type: String,
        },
        region:{
            type:String,
            required:true        
        },
        duration:{
            type: Number,
            required:true        
        },
        durationType:{
            type: String,
        },
        pickUp:{
            type: String,
        },
        openTime:{
            type: Date,
            required:true        
        },        
        closeTime:{
            type:Date,
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
        images:[{ 
            urlImage: String,
          }],
        plan:[{ 
            time: String,
            description: String
        }],
        status:{
            type: Number,
            required:true        
        },
        updatedAt: { type: Date, default: utcToZonedTime(now, 'Asia/Ho_Chi_Minh') }
    },{
        autoCreate: false,
        autoIndex: true
    })
)