import multer from "multer";
import fs from 'fs'
import {
    handleFilter
} from "../../services/toursService.js" ;
export const filterTour = async (req, res) =>{
    try{
        let region = req.body.region;
        let maximumPrice = req.body.maximumPrice;
        let minimumPrice = req.body.minimumPrice;
        let duration = req.body.duration;
        let from = req.body.from;
        let to = req.body.to;
        let name = req.body.name;
        let category = req.body.category;
        let urlImageN1Array = {};
        let tourData = await handleFilter(region, category, maximumPrice, minimumPrice, duration, from, to, name);
        if(tourData.data == {})
        {
            urlImageN1Array = tourData.data.map(async (item) => 
            {
                let imagePaths = item.urlImageN1;
                if( imagePaths == 'none' || imagePaths =='no image')
                {
                    let tempImagePaths = "src/public/default/tour.jpg";
                    try {
                        item.urlImageN1 = fs.readFileSync(tempImagePaths, {encoding: 'base64'});
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
                else {
                    
                    try {
                        item.urlImageN1 = fs.readFileSync(imagePaths, {encoding: 'base64'});
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
                return item;
            });
        }
        return res.status(tourData.status).json({
            errCode: tourData.errCode,
            message: tourData.errMessage,
            urlImageN1Array,
            tourData
        }) 
    }catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Error when filter',
        }) 
    }
}