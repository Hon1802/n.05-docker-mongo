import { Tour, Booking, Payment } from "../models/index.js";
import { mongoose } from "mongoose";
export const handleAddNewBooking = (
    tourId, 
    userId,  
    paymentId,
    children,
    adult,
    nChildren,
    nAdult,
    status = 1
    ) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let bookingData = {};
            let isExist = await Booking.findOne({idPayment: paymentId}).exec();
            if(isExist)
            {
                bookingData.status = 400;
                    bookingData.errCode = 2;
                    bookingData.errMessage = 'payment only use for one time'
                    resolve(bookingData)
            } else{
                try {
                    //insert db
                    const newBooking = await Booking.create({
                        idTour: new mongoose.Types.ObjectId(tourId),
                        idUser: new mongoose.Types.ObjectId(userId),
                        idPayment : paymentId,
                        children: children,
                        adult: adult,
                        nChildren: nChildren,
                        nAdult: nAdult,
                        status : status,
                    })
                    bookingData.status = 200;
                    bookingData.errCode = 0;
                    bookingData.errMessage ='Booking was create';
                    bookingData.data = {
                        ...newBooking._doc
                    }
                    resolve(bookingData)
                } catch(e){ 
                    bookingData.status = 400;
                    bookingData.errCode = 2;
                    bookingData.errMessage = 'Error when create'
                    resolve(bookingData)
                }  
            }
            
        }catch(e){
            let bookingData = {};
            bookingData.status = 400;
            bookingData.errCode = 3;
            bookingData.errMessage ='booking was not created'             
            resolve(bookingData)
        }
    })
};

export const handleHotTour = () =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let bookingData = {};
            try {
                const toursWithCounts = await Tour.aggregate([
                    {
                        $lookup: {
                            from: "bookings", 
                            let: { tourId: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ['$idTour', '$$tourId'] } // Match idTour with _id
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1 // Include other fields if needed
                                    }
                                }
                            ],
                            as: 'bookings'
                        }
                    },
                    {
                        $addFields: {
                            bookingsCount: { $size: '$bookings' },
                          
                        }
                    },
                    {
                        $limit: 10,
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1, // Add other fields from Tour you want to retrieve
                            description: 1,
                            // Include the bookingsCount field
                            urlImageN1: 1,
                            bookingsCount: 1,
                        }
                    },
                    {
                        $sort: { bookingsCount: -1 } // Sort by bookingsCount
                    }
                    ]);
                
                // console.log('Tours with booking counts:', toursWithCounts);

                bookingData.status = 200;
                bookingData.errCode = 0;
                bookingData.errMessage ='Success';
                bookingData.data = toursWithCounts;
                resolve(bookingData)
            } catch(e){ 
                console.log(e)
                bookingData.status = 400;
                bookingData.errCode = 2;
                bookingData.errMessage = 'Error when get'
                resolve(bookingData)
            }              
        }catch(e){
            let bookingData = {};
            bookingData.status = 400;
            bookingData.errCode = 3;
            bookingData.errMessage ='booking was not created'             
            resolve(bookingData)
        }
    })
};