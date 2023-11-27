import { ObjectId } from "bson";
import mongoose, { Schema } from "mongoose";
import { utcToZonedTime } from 'date-fns-tz'
// 
const now = new Date();
export default mongoose.model('Booking',
    new Schema({
        id:{type: ObjectId},
        idTour:{
            type: ObjectId,
            required:true        
        },
        idUser:
        {
            type: ObjectId,
            required:true        
        },   
        idPayment:
        {
            type: String,
            require: true
        },     
        children:[{ 
            firstName: String,
            lastName: String,
            gender: String
          }],
        adult:[{ 
            firstName: String,
            lastName: String,
            gender: String
          }],
        nChildren:{
            type: Number,
        },
        nAdult:{
            type: Number,
            require: true
        },
        // 4 status, 0 no active, 1 active, 2 sold, 3 traveling
        status:{
            type:String,
            required:true        
        }
        ,
        updatedAt: { type: Date, default: utcToZonedTime(now, 'Asia/Ho_Chi_Minh') }
    },{
        autoCreate: false,
        autoIndex: true
    })
)