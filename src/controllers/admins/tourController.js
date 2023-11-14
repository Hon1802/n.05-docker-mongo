import {
    handleAddNewTour,
    uploadImages,
    changeStatusTour,
    handleGetTourById,
    handleGetAllTour,
    checkExist,
    handleUpdateTourById
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
    let originalPrice = req.body.originalPrice;
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
    let tourData = await handleAddNewTour(description, nameTour, region, duration, originalPrice, destination, status);
    return res.status(tourData.status).json({
        errCode: tourData.errCode,
        message: tourData.errMessage,
        tourData
    }) 
}
// update tour by id
export const updateTourById = async(req, res) =>{
    try{
        let nameTour = req.body.name;
        let description = req.body.description;
        let destination = req.body.destination;
        let region = req.body.region;
        let duration = req.body.duration;
        let originalPrice = req.body.originalPrice;
        let status = req.body.status;
        let tourId = req.body.id;
        if( await checkExist(nameTour, 'name'))
        {
            return res.status(400).json({
                errCode: 1,
                message: 'Name tour already to use',
            }) 
        } else{
            let tourData = await handleUpdateTourById(tourId, nameTour, description, destination, region, duration, originalPrice, status);
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
            let image1 = tourData.data.urlImageN1;
            let image2 = tourData.data.urlImageN2;
            let image3 = tourData.data.urlImageN3;
            if( image1 == 'none' || image1 =='no image' )
            {
                image1 = "src/public/default/tour.jpg";
            }
            if( image2 == 'none' )
            {
                image2 = "src/public/default/tour.jpg";
            }
            if( image3 == 'none' )
            {
                image3 = "src/public/default/tour.jpg";
            }
            // Example usage
            const imagePaths = [image1, image2, image3];
            const base64ImagesArray = [];
            convertImage(imagePaths)
            .then((base64Images) => {
                base64ImagesArray.push(...base64Images);
                if(tourData.errCode == 2)
                {
                    tourData = {
                        ...tourData.data,
                        imageBase64Array : base64ImagesArray
                    },
                    tourData.status = 200
                }
                return res.status(tourData.status).json({
                    errCode: tourData.errCode,
                    message: tourData.errMessage,
                    tourData
                }) 
            })
            .catch((error) => {
                console.error('Error:', error);
                return res.status(400).json({
                    errCode: 4,
                    message: 'Error when get tour',
                }) 
            });
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
            let imagePaths = item.urlImageN1;
            if( imagePaths !== 'none')
            {
                try {
                    item.urlImageN1 = fs.readFileSync(imagePaths, {encoding: 'base64'});
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            else {
                item.urlImageN1 = 'no image';
            }
            return item;
        });
    return res.status(tourData.status).json({
        errCode: tourData.errCode,
        message: tourData.message,
        urlImageN1Array,
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
        console.error('Error:', error);
        throw 'Internal Server Error';
    }
};
const readFileAsync = (urlPath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(urlPath, (err, data) => {
            if (err) {
                console.log(err);
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
    