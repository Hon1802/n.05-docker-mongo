import {
    handleAddNewTour,
    uploadImages,
    changeStatusTour,
    handleGetTourById,
    handleGetAllTour,
    checkExist
} from "../../services/toursService.js" ;
import multer from "multer";
import fs from 'fs'

//add new
export const handleAddNew = async (req, res) =>{
    let nameTour = req.body.name;
    let description = req.body.description;
    let types = req.body.type;
    let status = req.body.status;
    if (!nameTour || !description || !types){
        return res.status(500).json({
            errCode: 1,
            message:"Missing inputs value"
        }) 
    }
    if(!status){
        status = "1";
    }
    let tourData = await handleAddNewTour(description, nameTour, types, status);
    return res.status(200).json({
        errCode: tourData.errCode,
        message: tourData.errMessage,
        tourData
    }) 
}
//
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
            return res.status(200).json({
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
    return res.status(200).json({
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
            let image1= tourData.data.urlImageN1 || "src/public/default/avatar.jpg";
            let image2= tourData.data.urlImageN2 || "src/public/default/avatar.jpg";
            let image3= tourData.data.urlImageN3 || "src/public/default/avatar.jpg";
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
                    }
                }
                return res.status(200).json({
                    errCode: tourData.errCode,
                    message: tourData.message,
                    tourData
                }) 
            })
            .catch((error) => {
                console.error('Error:', error);
                return res.status(200).json({
                    errCode: 404,
                    message: 'Black Pink',
                }) 
            });
        }
    } catch(e)
    {
        return res.status(200).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}

//get all tour
export const getAllTour = async(req, res) =>{
    let tourData = await handleGetAllTour();
    return res.status(200).json({
        errCode: tourData.errCode,
        message: tourData.errMessage,
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

// const convertImage = (urlPath) => {
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
