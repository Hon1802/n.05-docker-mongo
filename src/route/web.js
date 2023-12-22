import express from "express";
//import controllers
import {    getHomePage    } from "../controllers/homeController.js";
import { handleLogin,
         handleLogOut,
         handleRegister,
         updateAvatar,
         getUserById,
         updateInfoById,
         deleteUserById,
         updateNewPassword,
         getAllUser,
         removeUserById
        } 
    from "../controllers/customers/userController.js" ;
import {
    handleAddNew,
    updateImageTours,
    updateTourById,
    updateStatusTour,
    getTourById, 
    getAllTour
} from "../controllers/admins/tourController.js"
import {addNewTicket}
from "../controllers/admins/ticketController.js"
import {
    filterTour,
    latestTour,
    hotTour,
    getTourRegister
}
from "../controllers/customers/customerController.js"
import {handlePayment,
    handleBooking,
    handleCheckBooking
}
    from "../controllers/customers/paymentController.js"

import {getListFlight,
    getAirport,
    getListHotelByCity,
    getHotelOfferSearch
} 
from "../controllers/customers/flightController.js"
import {
    getAllOrder
} from "../controllers/admins/adminController.js"
let router = express.Router();
let initWebRoutes = (app)=>{
    router.get('/', (req,res)=>{
        return res.json({data:'hello word'})
    });
    router.get('/homePage', getHomePage);
    router.get('/getById/:id', (req,res)=>{
        res.send('get by id' + req?.params?.id??"")
    });
    //login email
    router.post('/api/login', handleLogin );
    router.post('/api/register', handleRegister );
    router.post('/api/logout', handleLogOut);
    router.post('/api/upload-avatar', updateAvatar);
    router.post('/api/update-password', updateNewPassword); 
    router.post('/api/personal', getUserById);
    router.post('/api/update-by-id', updateInfoById);
    router.post('/api/delete-account', deleteUserById);
    
    //tour
    //get tour by id
    router.post('/api/get-tour-by-id',getTourById );
    router.post('/api/get-all-tours', getAllTour);
    router.post('/api/filter-tours-by-price', getAllTour);
    router.post('/api/add-new-tour', handleAddNew);
    router.post('/api/update-images-tour', updateImageTours);
    router.post('/api/update-status-tour', updateStatusTour);
    router.post('/api/update-tour-by-id', updateTourById);
    // Customer
    router.post('/api/filter-tour', filterTour);
    router.post('/api/hot-tour', filterTour);
    router.get('/api/latest-tour', latestTour);
    router.post('/api/get-tour-register',  getTourRegister);
    //Booking
    router.post('/api/create-booking', handleBooking);
    router.post('/api/check-booking', handleCheckBooking);
    router.get('/api/hot-tour', hotTour);
    router.post('/api/create-payment', handlePayment);
    //admin
    router.post('/api/admin/get-all-user', getAllUser);
    router.post('/api/admin/remove-account', removeUserById);
    router.post('/api/admin/get-all-order-tour', getAllOrder);
    
    //ticket
    //get ticket by id
    router.post('/api/get-ticket-by-id');
    router.post('/api/get-all-ticket');
    router.post('/api/add-new-ticket', addNewTicket);
    router.post('/api/update-status-ticket');
    // flight
    router.post('/api/get-flight-list', getListFlight);
    router.get('/api/get-airport', getAirport);
    //hotel
    router.post('/api/get-hotel-by-city', getListHotelByCity);
    router.post('/api/get-hotel-offers-search', getHotelOfferSearch);
    //admin
    // router.post('/api/admin/get-order', getOder);
    return app.use("/", router);
}

export default initWebRoutes;