import {
    handleAddNewTour,
    uploadImages,
    changeStatusTour,
    handleGetTourById,
    handleGetAllTour,
    checkExist,
    handleUpdateTourById,
} from "../../services/toursService.js" ;
import multer from "multer";
import fs from 'fs'
//add new
export const handleAddNew = async (req, res) =>{
    let nameTour = req.body.name;
    let description = req.body.description;
    let destination = req.body.destination;
    let region = req.body.region;
    let duration = req.body.duration;
    let childPrice = req.body.childPrice;
    let adultPrice = req.body.adultPrice;
    let openTime = req.body.openTime;
    let closeTime = req.body.closeTime;
    let status = req.body.status;
    if (!nameTour || !description || !region ){
        return res.status(400).json({
            errCode: 1,
            message:"Missing inputs value"
        }) 
    }
    if(!status){
        status = "1";
    }
    let tourData = await handleAddNewTour(nameTour, 
                                        description, 
                                        destination, 
                                        region, 
                                        duration, 
                                        childPrice, 
                                        adultPrice,
                                        openTime,
                                        closeTime, 
                                        status);
    return res.status(tourData.status).json({
        errCode: tourData.errCode,
        message: tourData.errMessage,
        tourData
    }) 
}
// update tour by id
export const updateTourById = async(req, res) =>{
    try{
        let tourId = req.body.id;
        let nameTour = req.body.name;
        let description = req.body.description;
        let destination = req.body.destination;
        let region = req.body.region;
        let duration = req.body.duration;
        let displayPrice = req.body.displayPrice;
        let childPrice = req.body.childPrice;
        let adultPrice = req.body.adultPrice;
        let departureTime = req.body.departureTime;
        let returnTime = req.body.returnTime;
        let status = req.body.status;
        if( await checkExist(nameTour, 'name'))
        {
            return res.status(400).json({
                errCode: 1,
                message: 'Name tour already to use',
            }) 
        } else{
            let tourData = await handleUpdateTourById(
                tourId, 
                nameTour, 
                description, 
                destination, 
                region, 
                duration, 
                displayPrice, 
                childPrice, 
                adultPrice, 
                departureTime,
                returnTime,
                status);
            return res.status(tourData.status).json({
                errCode: tourData.errCode,
                message: tourData.errMessage,
                tourData
            }) 

        }
    }catch(e)
    {
        return res.status(400).json({
            errCode: 1,
            message: 'Error when update',
        }) 
    }
};

//update images
export const updateImageTours = async (req, res) =>{
    try{
        upload.array('image')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    errCode: 400,
                    message: "Error uploading image.",
                });
            }
            let tourId = req.body.id;
            let paths = req.files.map(file => 'src/public/imageTour/' + file.filename);
            let tourData = await uploadImages(paths, tourId);
            return res.status(tourData.status).json({
                errCode: tourData.errCode,
                message: tourData.errMessage,
                tourData
            }) 
        }); 
    } catch(e)
    {
        console.log(e)
    } 
}

//update status tour
export const updateStatusTour = async(req, res) =>{
    let tourId = req.body.id;
    let tourStatus = req.body.status;
    let tourData = await changeStatusTour(tourId, tourStatus);
    return res.status(tourData.status).json({
        errCode: tourData.errCode,
        message: tourData.errMessage,
        tourData
    }) 
}

//get tour by id 
// images return have form array, include 3 image
export const getTourById = async (req, res) => {
    try{
        let tourId = req.body.id;
        if(await checkExist(tourId, 'id'))
        {
            let tourData = await handleGetTourById(tourId);
            let base64ImagesArray = [];
            const temp = await Promise.all(tourData.data.images.map(async (urlIma) => {
                let imagePaths = urlIma.urlImage;
                if( imagePaths == 'none' || imagePaths =='no image')
                {
                    let array = ["src/public/default/tour.jpg", "src/public/default/tour-default-1.jpg", "src/public/default/tour-default-2.jpg", "src/public/default/tour-default-3.jpg", "src/public/default/tour-default-4.jpg", "src/public/default/tour-default-5.jpg","src/public/default/tour-default-6.jpg","src/public/default/tour-default-7.jpg"];
                    let randomIndex = Math.floor(Math.random() * array.length);
                    let randomElement = array[randomIndex];
                    let tempImagePaths = randomElement;
                    try {
                        const base64Image = fs.readFileSync(tempImagePaths, {encoding: 'base64'});
                        base64ImagesArray.push(base64Image); // Thêm base64Image vào mảng base64ImagesArray
                        
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
                else {
                    try {
            
                        const base64Image = fs.readFileSync(imagePaths, {encoding: 'base64'});
                        base64ImagesArray.push(base64Image);
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
                return urlIma; // Trả về đường dẫn urlImage
            }));
            tourData = {
                ...tourData.data,
                images:'',
                imageBase64Array : base64ImagesArray
            },
            tourData.status = 200
            return res.status(tourData.status).json({
                errCode: tourData.errCode,
                message: tourData.errMessage,
                tourData
            }) 
        }
    } catch(e)
    {
        return res.status(400).json({
            errCode: 3,
            message: 'Not found',
        }) 
    }
}

//get all tour
export const getAllTour = async(req, res) =>{
    let tourData = await handleGetAllTour();
    const urlImageN1Array = tourData.data.map(async (item) => 
        {
            const temp = await Promise.all(item.images.map(async (urlIma) => {
                let imagePaths = urlIma.urlImage;
                if( imagePaths !== 'none')
                {
                    try {
                        item.urlImageN1 = fs.readFileSync(imagePaths, {encoding: 'base64'});
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
                else {
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
                    // item.urlImageN1 = 'no image';
                }
                return urlIma; // Trả về đường dẫn urlImage
            }));
            return item;
        });
    return res.status(tourData.status).json({
        errCode: tourData.errCode,
        message: tourData.message,
        tourData
    }) 
}
//function for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/public/imageTour');
    },
    filename: (req, file, cb) => {
    //   cb(null, file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });
export const upload = multer({ storage });

// function for many image
const convertImage = async (urlPaths) => {
    try {
        const base64Images = await Promise.all(
            urlPaths.map((urlPath) => readFileAsync(urlPath))
        );

        return base64Images;
    } catch (error) {
        // console.error('Error:', error);
        throw 'Internal Server Error';
    }
};
const readFileAsync = (urlPath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(urlPath, (err, data) => {
            if (err) {
                // console.log(err);
                reject('Internal Server Error');
            } else {
                // Convert data to Base64
                const base64Image = data.toString('base64');
                resolve(base64Image);
            }
        });
    });
};
// function for each image

const convertOneImage = async (urlPath) => {
    // try {
        const data = await fs.readFile(urlPath);
        const base64Image = data.toString('base64');
        return base64Image;
};
// const convertOneImage = (urlPath) => {
//     return new Promise((resolve, reject) => {
//         fs.readFile(urlPath, (err, data) => {
//             if (err) {
//                 console.log(err);
//                 reject('Internal Server Error');
//             } else {
//                 // Convert data to Base64
//                 const base64Image = data.toString('base64');
//                 resolve(base64Image);
//             }
//         });
//     });
// };
    