import { Tour, Booking, Payment } from "../models/index.js";
import { mongoose } from "mongoose";
export const handleAddNewPayment = (
    tourId, 
    userId, 
    paymentId, 
    paymentSource, 
    payer,
    totalPrice,
    status = 1,
    update_time,
    ) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let paymentData = {};
            try {
                //insert db
                const newPayment = await Payment.create({
                    idTour: new mongoose.Types.ObjectId(tourId),
                    idUser: new mongoose.Types.ObjectId(userId),
                    idPayment: paymentId,
                    paymentSource: paymentSource,
                    payer: payer,
                    totalPrice: totalPrice,
                    timePay: update_time,
                    status : status,
                })
                paymentData.status = 200;
                paymentData.errCode = 0;
                paymentData.errMessage ='Payment was create';
                paymentData.data = {
                    ...newPayment._doc
                }
                resolve(paymentData)
            } catch(e){ 
                console.log(e)
                paymentData.status = 400;
                paymentData.errCode = 2;
                paymentData.errMessage = 'Error when create'
                resolve(paymentData)
            }  
            
        }catch(e){
            let paymentData = {};
            paymentData.status = 400;
            paymentData.errCode = 3;
            paymentData.errMessage ='Payment was not created'             
            resolve(paymentData)
        }
    })
};

// get by id
export const handleGetInformationPaymentById =async (paymentId) =>{
    try{
        let tourData = {};
        // let isExist = await Tour.findOne({_id: tourId }).exec()  
        const query = { idPayment: paymentId };   
        let isExist = await Payment.findOne(query);  
        let modifiedData =[];      
        if(isExist)
        {   
            tourData.data = {
                ...isExist.toObject()
            }
            
            modifiedData.push({
                totalPrice : tourData.data.totalPrice || 'none',
            })
        }
        return modifiedData
    }catch(e){
        let modifiedData =[];   
        return modifiedData  
    }
};
