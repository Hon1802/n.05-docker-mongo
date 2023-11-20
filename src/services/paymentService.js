import { Tour, Booking, Payment } from "../models/index.js";
export const handleAddNewPayment = (
    tourId, 
    userId, 
    method, 
    totalPrice,
    note,
    status = 1
    ) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let paymentData = {};
            let isExist = await Tour.findOne({_id: tourId }).exec();            
            if(isExist)
            {   
                try {
                    //insert db
                    const newPayment = await Payment.create({
                        idTour: tourId,
                        idUser: userId,
                        method: method,
                        totalPrice: totalPrice,
                        note: note,
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
            }else{
                tourData.status = 400;
                tourData.errCode = 1;
                tourData.errMessage ='Tour not exist'            
                resolve(tourData)
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
