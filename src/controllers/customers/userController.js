import {
    handleUserLogin,
    handleUserRegister,
    uploadAvatar, 
    checkExist,
    getById,
    updateById,
    updatePassword,
    changeStatusUser,
    handleUserLogOut
} from "../../services/userService.js" ;
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import multer from "multer";
//login
export const handleLogin = async (req,res) =>{
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password){
        return res.status(400).json({
            errCode: 1,
            message:"Missing inputs value"
        }) 
    
    }
    let userData = await handleUserLogin(email, password);

    return res.status(userData.status).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        // yourEmail: email
        userData
    }) 
}
//logout
export const handleLogOut = async (req, res) =>{
    let userId = req.body.id;
    if (!userId){
        return res.status(400).json({
            errCode: 1,
            message:"Missing inputs value"
        }) 
    }
    let userData = await handleUserLogOut(userId);
    return res.status(userData.status).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        // yourEmail: email
    }) 
}
//register
export const handleRegister = async (req, res) =>{
    let fullName = req.body.fullName;
    let address = req.body.address;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let gender = req.body.gender;
    if (!email || !password){
        return res.status(400).json({
            errCode: 1,
            message:"Missing inputs value"
        }) 
    }
    let userData = await handleUserRegister(fullName, address, email,password, phone, gender);

    return res.status(userData.status).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        userData
    }) 
}
//update avatar
export const updateAvatar = async (req, res) =>{
    try{
        upload.single('image')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    errCode: 400,
                    message: "Error uploading image.",
                });
            }
            let pathName = req.file.filename;
            let userId = req.body.id;
            let pathFile = 'src/public/imageUser/' + pathName;
            let userData = await uploadAvatar(pathFile, userId);
            console.log(await checkExist(userId, 'id')) 
            return res.status(200).json({
                errCode: userData.errCode,
                message: userData.errMessage,
                userData
            }) 
        }); 
    } catch(e)
    {
        console.log(e)
    } 
}
// get user by id
export const getUserById = async (req, res) => {
    try{
        let userId = req.body.id;
        if(await checkExist(userId, 'id'))
        {
            let userData = await getById(userId);
            const imagePath = userData.data.urlAvatar || "src/public/default/avatar.jpg";
            let base64Image = '';
            fs.readFile(imagePath, async (err, data)  => {
                if (err) {
                    console.log(err)
                  return res.status(500).send('Internal Server Error');
                }
                // Trans from image to Base64
                base64Image = data.toString('base64');
                if(userData.errCode == 2)
                {
                    userData = {
                        ...userData.data,
                        avatarBase64 : base64Image,
                    }
                }
                return res.status(200).json({
                    errCode: userData.errCode,
                    message: userData.message,
                    userData
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
// update information by id
export const updateInfoById = async (req, res) => {
    try {
        let userId = req.body.id;
        let address = req.body.address;
        let phone = req.body.phone;
        let gender = req.body.gender;
        let userData = await updateById(userId, address, phone, gender);
        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.message,
            userData
        }) 
    } catch(e)
    {
        return res.status(200).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
//update new password
export const updateNewPassword = async (req, res) => {
    try {
        let userId = req.body.id;
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;
        
        let userData = await updatePassword(userId, oldPassword, newPassword);
        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.message,
            userData
        }) 
    } catch(e)
    {
        return res.status(200).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
//update new password
export const deleteUserById = async (req, res) => {
    try {
        let userId = req.body.id;
        let password = req.body.password;
        let userData = await changeStatusUser(userId, password);
        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.message,
            userData
        }) 
    } catch(e)
    {
        return res.status(200).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
//function for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/public/imageUser');
    },
    filename: (req, file, cb) => {
    //   cb(null, file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });
export const upload = multer({ storage });

