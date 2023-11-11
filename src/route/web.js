import express from "express";
//import controllers
import {    getHomePage    } from "../controllers/homeController.js";
import { handleLogin,
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
    updateImageTours
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
    router.post('/api/upload-avatar', updateAvatar);
    router.post('/api/update-password', updateNewPassword); 
    router.get('/api/personal', getUserById);
    router.post('/api/update-by-id', updateInfoById);
    router.post('/api/delete-account', deleteUserById);
    //tour
    //get tour by id
    router.get('/api/get-tour-by-id');
    router.get('/api/get-all-tours');
    router.post('/api/add-new-tour', handleAddNew);
    router.post('/api/update-images-tour', updateImageTours);
    router.post('/api/update-status-tour');
    //ticket
    //get ticket by id
    router.get('/api/get-ticket-by-id');
    router.get('/api/get-all-ticket');
    router.post('/api/add-new-ticket');
    router.post('/api/update-status-ticket');
    return app.use("/", router);
}

export default initWebRoutes;