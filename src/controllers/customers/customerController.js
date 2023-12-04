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
        let from = req.body.from;
        from = from.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let to = req.body.to;
        to = to.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let region = req.body.region;
        let duration = req.body.durationType;
        let budget = req.body.budget;
        let nNight = req.body.nNight;
        let nDay = req.body.nNight;
        let name = req.body.name;
        name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let tourData = await handleFilter(
            from, 
            to, 
            region, 
            duration, 
            budget,  
            name);
        const urlImageN1Array = tourData.data.map(async (item) => 
        {
            
            const temp = await Promise.all(item.images.map(async (urlIma) => {
                let imagePaths = urlIma.urlImage;
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
                }
                return urlIma;
            }));
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
            // console.log(item);
            const temp = await Promise.all(item.images.map(async (urlIma) => {
                let imagePaths = urlIma.urlImage;
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
                }
                return urlIma; // Trả về đường dẫn urlImage
            }));
            return item;
        });
        // console.log(tourData.data.urlImageN1);
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
            // console.log(item);
            const temp = await Promise.all(item.images.map(async (urlIma) => {
                let imagePaths = urlIma.urlImage;
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
                }
                return urlIma; // Trả về đường dẫn urlImage
            }));
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