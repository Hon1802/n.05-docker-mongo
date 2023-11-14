import {
    handleAddNewTicket
} from "../../services/ticketService.js" ;
//add new
export const addNewTicket = async (req, res) =>{
    let tourId = req.body.idTour;
    let childPrice = req.body.childPrice;
    let adultPrice = req.body.adultPrice;
    let departureTime = req.body.departureTime;
    let returnTime = req.body.returnTime;
    let status = req.body.status;
    if (!tourId || !childPrice || !adultPrice || !departureTime || !returnTime ){
        return res.status(400).json({
            errCode: 1,
            message:"Missing inputs value"
        }) 
    }
    if(!status){
        status = "1";
    }
    let tourData = await handleAddNewTicket(tourId, childPrice, adultPrice, departureTime, returnTime, status);
    return res.status(tourData.status).json({
        errCode: tourData.errCode,
        message: tourData.errMessage,
        tourData
    }) 
}