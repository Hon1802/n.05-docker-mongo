import { handleAddNewTour } from "../src/services/toursService.js";
import * as data from "./tour.json" assert { type: "json" };

export const uploadTour = async() => { 
    for (var i = 0; i < data.default.length; i++)
    {
        try {

            await uploadEach(data.default[i]);
        }catch(e)
        {
            console.log('cant upload')
        }
       
    }
}

async function uploadEach(item) {
    return await handleAddNewTour(
        item.name, 
        item.description, 
        item.destination, 
        item.region, 
        item.duration, 
        item.displayPrice,
        item.childPrice, 
        item.adultPrice, 
        item.departureTime,
        item.returnTime,
        item.status)
}