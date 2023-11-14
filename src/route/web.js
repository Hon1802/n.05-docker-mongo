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
         updateNewPassword
        } 
    from "../controllers/customers/userController.js" ;
import {
    handleAddNew,
    updateImageTours,
    updateTourById,
    updateStatusTour,
    getTourById, 
    getAllTour,
    filterTour
} from "../controllers/admins/tourController.js"


let router = express.Router();
let initWebRoutes = (app)=>{
    router.get('/', (req,res)=>{
        return res.json({data:'hello word'})
    });
    router.get('/homePage', getHomePage);
    router.get('/getById/:id', (req,res)=>{
        res.send('get by id' + req?.params?.id??"")
    });
    router.post('/api/login', handleLogin );
    router.post('/api/register', handleRegister );
    router.post('/api/logout', handleLogOut);
    router.post('/api/upload-avatar', updateAvatar);
    router.post('/api/update-password', updateNewPassword); 
    router.get('/api/personal', getUserById);
    router.post('/api/update-by-id', updateInfoById);
    router.post('/api/delete-account', deleteUserById);
    //tour
    //get tour by id
    router.get('/api/get-tour-by-id',getTourById );
    router.get('/api/get-all-tours', getAllTour);
    router.get('/api/filter-tours-by-price', getAllTour);
    router.post('/api/add-new-tour', handleAddNew);
    router.post('/api/update-images-tour', updateImageTours);
    router.post('/api/update-status-tour', updateStatusTour);
    router.post('/api/update-tour-by-id', updateTourById);
    // filter
    router.get('/api/filter-tour', filterTour);
    //ticket
    //get ticket by id
    router.get('/api/get-ticket-by-id');
    router.get('/api/get-all-ticket');
    router.post('/api/add-new-ticket', addNewTicket);
    router.post('/api/update-status-ticket');
    return app.use("/", router);
}

export default initWebRoutes;