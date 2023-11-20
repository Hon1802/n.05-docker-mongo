import { ObjectId } from "bson";
import mongoose, { Schema } from "mongoose";
import { utcToZonedTime } from 'date-fns-tz'
// Lấy thời gian hiện tại và chuyển về múi giờ mong muốn
const now = new Date();
export default mongoose.model('Payment',
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
        }
        ,        
        method:{
            type: String,
            required:true        
        },
        totalPrice:{
            type: Number,
            require: true,
        },
        note:{
            type: String,
            require: true,
        },
        //  0 no active, 1 active
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