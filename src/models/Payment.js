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
        },     
        idPayment:{
            type: String,
            require: true
        },   
        paymentSource:{
            type: Object,
            required:true        
        },
        payer:{
            type: Object,
            required:true        
        },
        totalPrice:{
            type: Number,
            require: true,
        },
        //  0 no active, 1 active
        status:{
            type:String,
            required:true        
        },
        timePay: {
            type: Date
        },
        updatedAt: { type: Date, default: utcToZonedTime(now, 'Asia/Ho_Chi_Minh') }
    },{
        autoCreate: false,
        autoIndex: true
    })
)