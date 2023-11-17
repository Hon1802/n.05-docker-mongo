import { handleAddNewTour } from "./services/toursService.js";
import * as data from "./tour.json" assert { type: "json" };

export const upload = () => { 
    for (var i = 0; i < data.default.length; i++)
    {
        uploadEach(data.default[i]);
    }
}

function uploadEach(item) {
    return handleAddNewTour(item.name, 
        item.description, 
        item.destination, 
        item.region, 
        item.duration, 
        item.displayPrice,
        item.childPrice, 
        item.adultPrice, 
        item.status)
}