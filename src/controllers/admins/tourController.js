import {
    handleAddNewTour,
    uploadImages
} from "../../services/toursService.js" ;
import multer from "multer";
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