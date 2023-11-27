import multer from "multer";
import fs from 'fs'
import {
    handleFilter,
    getLastTour
} from "../../services/toursService.js" ;
import {
    handleHotTour
} from "../../services/bookingService.js" ;
export const filterTour = async (req, res) =>{
    try{
        let region = req.body.region;
        let maximumPrice = req.body.maximumPrice;
        let minimumPrice = req.body.minimumPrice;
        let duration = req.body.duration;
        let from = req.body.from;
        let to = req.body.to;
        let name = req.body.name;
        let tourData = await handleFilter(
            region, 
            maximumPrice, 
            minimumPrice, 
            duration, 
            from, 
            to, 
            name);
        const urlImageN1Array = tourData.data.map(async (item) => 
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
        return res.status(tourData.status).json({
            errCode: tourData.errCode,
            message: tourData.errMessage,
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

export const latestTour = async (req, res) =>{
    try{
        let tourData = await getLastTour();
        const urlImageN1Array = tourData.data.map(async (item) => 
            {
                let imagePaths = item.urlImageN1;
                if( imagePaths == 'none' || imagePaths =='no image')
                {
                    // let tempImagePaths = "src/public/default/tour.jpg";
                    let array = ["src/public/default/tour.jpg", "src/public/default/tour-default-1.jpg", "src/public/default/tour-default-2.jpg", "src/public/default/tour-default-3.jpg", "src/public/default/tour-default-4.jpg", "src/public/default/tour-default-5.jpg","src/public/default/tour-default-6.jpg","src/public/default/tour-default-7.jpg"];
                    // Lấy một chỉ số ngẫu nhiên trong khoảng từ 0 đến độ dài của mảng
                    let randomIndex = Math.floor(Math.random() * array.length);
                    // Lấy phần tử từ mảng dựa trên chỉ số ngẫu nhiên đã tạo
                    let randomElement = array[randomIndex];
                    let tempImagePaths = randomElement;
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
        return res.status(tourData.status).json({
            errCode: tourData.errCode,
            message: tourData.errMessage,
            tourData
        }) 
    }catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Error when get',
        }) 
    }
}
export const hotTour = async (req, res) =>{
    try{
        let tourData = await handleHotTour();
        const urlImageN1Array = tourData.data.map(async (item) => 
        {
            let imagePaths = item.urlImageN1;
            if( imagePaths == 'none' || imagePaths =='no image')
            {

                // let tempImagePaths = "src/public/default/tour.jpg";
                let array = ["src/public/default/tour.jpg", "src/public/default/tour-default-1.jpg", "src/public/default/tour-default-2.jpg", "src/public/default/tour-default-3.jpg", "src/public/default/tour-default-4.jpg", "src/public/default/tour-default-5.jpg","src/public/default/tour-default-6.jpg","src/public/default/tour-default-7.jpg"];
                // Lấy một chỉ số ngẫu nhiên trong khoảng từ 0 đến độ dài của mảng
                let randomIndex = Math.floor(Math.random() * array.length);
                // Lấy phần tử từ mảng dựa trên chỉ số ngẫu nhiên đã tạo
                let randomElement = array[randomIndex];
                let tempImagePaths = randomElement;
                console.log(randomElement);
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
        return res.status(tourData.status).json({
            errCode: tourData.errCode,
            message: tourData.errMessage,
            tourData
        }) 
    }catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Error when get',
        }) 
    }
}