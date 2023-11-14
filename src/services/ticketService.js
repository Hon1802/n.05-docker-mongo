import { Tour, Ticket } from "../models/index.js";
export const handleAddNewTicket = (tourId, childPrice, adultPrice, departureTime, returnTime, status = 1) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let ticketData = {};
            let isExist = await Tour.findOne({_id: tourId }).exec();            
            if(isExist)
            {   
                try {
                    //insert db
                    const newTicket = await Ticket.create({
                        idTour: tourId,
                        childPrice: childPrice,
                        adultPrice: adultPrice,
                        departureTime: departureTime,
                        returnTime: returnTime,
                        status : status,
                    })
                    ticketData.status = 200;
                    ticketData.errCode = 0;
                    ticketData.errMessage ='ticket was create';
                    ticketData.data = {
                        ...newTicket._doc
                    }
                    resolve(ticketData)
                } catch(e){
                    ticketData.status = 400;
                    ticketData.errCode = 2;
                    ticketData.errMessage = 'Error when create'
                    resolve(ticketData)
                }  
            }else{
                tourData.status = 400;
                tourData.errCode = 1;
                tourData.errMessage ='Your tour was not exist'            
                resolve(tourData)
            }
        }catch(e){
            let ticketData = {};
            ticketData.status = 400;
            ticketData.errCode = 3;
            ticketData.errMessage ='ticket was not created'             
            resolve(ticketData)
        }
    })
};