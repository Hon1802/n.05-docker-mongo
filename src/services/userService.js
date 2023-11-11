import { resolve } from "path";
import { User } from "../models/index.js"
import { rejects } from "assert";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { salt_rounds , jwt_secret} from "../config/main.js";
// check login
export const handleUserLogin = (email,password) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            let isExist = await User.findOne({email}).exec();
            if(isExist && isExist.status == 1)
            {   
                //check password compare with password encrypt     
                let isMatch = await bcrypt.compare(password,isExist.password)
                if(!!isMatch){
                    //create java web token
                    // use for user use web, if you have token you will have role to do st, if you have't you can't do it, and login and register need't token
                    let token = jwt.sign({
                        data: isExist
                        }, 
                        jwt_secret,
                        {
                            expiresIn: '30 days' // 30 day

                        }
                    )
                    userData.errCode = 2;
                    userData.errMessage ='you can get access token';
                    userData.data = {
                        ...isExist.toObject(),
                        password:'Not show',
                        token: token
                    }
                    resolve(userData)
                } else {
                    userData.errCode = 2;
                    userData.errMessage ='Wrong password'
                    resolve(userData)
                }
                resolve()
            }else{
                userData.errCode = 1;
                userData.errMessage ='Your account not exist'
                resolve(userData)
            }
        }catch(e){
            userData.errCode = 3;
            userData.errMessage ='Error connect'
            rejects(userData)
        }
    })
};
// register
export const handleUserRegister = (fullName, address, email,password, phone, gender) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            let isExist = await User.findOne({email}).exec();            
            if(isExist)
            {   
                userData.errCode = 1;
                userData.errMessage ='Your account was exist'            
                resolve(userData)
            }else{
                try {
                    const hashedPassword = await bcrypt.hash(password,parseInt(salt_rounds))
                    //insert db
                    const newUser = await User.create({
                        name: fullName,
                        address,
                        email,
                        password: hashedPassword,
                        phoneNumber: phone, 
                        gender, 
                        urlAvatar : 'none',
                        status: '1'
                    })
                    userData.errCode = 0;
                    userData.errMessage ='Your account was create';
                    userData.data = {
                        ...newUser._doc,
                        password: 'Not show'
                    }
                    resolve(userData)
                } catch(e){
                    userData.errCode = 2;
                    userData.errMessage = e
                    resolve(userData)
                }  
            }
        }catch(e){
            userData.errCode = 3;
            userData.errMessage ='Your account was not created'             
            rejects(userData)
        }
    })
};
//upload avatar to mongo
export const uploadAvatar = (path, idUser) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            const user = await User.updateOne(
                { _id: idUser }, // Filter: Find the user with the given id
                { $set: { urlAvatar: path } } // Update: Set the urlAvatar field to the new path
              );
            if (user.nModified === 0) {
            // If no user was modified, it means the user with the given id was not found
                userData.errCode = 404;
                userData.errMessage = 'User not found';
                resolve(userData);
            }

            userData.errCode = 0; // Assuming 0 means success
            userData.errMessage = 'Avatar uploaded successfully';
            resolve(userData);
        }catch(e){   
            userData.errCode = 3;
            userData.errMessage ='Error uploading avatar'             
            rejects(userData)
        }
    })
};
//get by id
export const getById = (userId) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            let isExist = await User.findOne({_id: userId }).exec()        
            if(isExist)
            {   
                userData.errCode = 2;
                userData.errMessage ='Get user by id success';
                userData.data = {
                    ...isExist.toObject(),
                    password:'Not show',
                }
                resolve(userData)
            }else{
                userData.errCode = 3;
                userData.errMessage ='Error connect'
                resolve(userData) 
            }
        }catch(e){
            userData.errCode = 3;
            userData.errMessage ='Your account was not created'             
            rejects(userData)
        }
    })
};
//update by id
export const updateById = (userId, address, phone, gender) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            const user = await User.updateOne(
                { _id: userId }, // Filter: Find the user with the given id
                { $set: { 
                    address: address,
                    phone: phone,
                    gender: gender
                 } } // Update: Set the urlAvatar field to the new path
              );
            if (user.nModified === 0) {
            // If no user was modified, it means the user with the given id was not found
                userData.errCode = 404;
                userData.errMessage = 'User not found';
                resolve(userData);
            }

            userData.errCode = 0; // Assuming 0 means success
            userData.errMessage = 'Uploaded successfully';
            resolve(userData);
        }catch(e){
            userData.errCode = 3;
            userData.errMessage ='Your account was not created'             
            rejects(userData)
        }
    })
};
//update password
export const updatePassword = (userId, oldPassword, newPassword) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            let isExist = await User.findOne({_id: userId }).exec();
            if(isExist)
            {   
                //check password compare with password encrypt     
                let isMatch = await bcrypt.compare(oldPassword,isExist.password)
                if(!!isMatch){
                    const hashedPassword = await bcrypt.hash(newPassword, parseInt(salt_rounds))
                    const user = await User.updateOne(
                        { _id: userId }, // Filter: Find the user with the given id
                        { $set: { 
                           password: hashedPassword
                         } } // Update: new pass
                      );
                    userData.errCode = 0;
                    userData.errMessage = 'Success';
                    resolve(userData);
                } else {
                    userData.errCode = 2;
                    userData.errMessage ='Wrong password'
                    resolve(userData)
                }
                resolve()
            }else{
                userData.errCode = 1;
                userData.errMessage ='Your account not exist'
                resolve(userData)
            }
        }catch(e){
            userData.errCode = 3;
            userData.errMessage ='Error connect'
            rejects(userData)
        }
    })
};
//update password
export const changeStatusUser = (userId, password) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let userData = {};
            let isExist = await User.findOne({_id: userId }).exec();
            if(isExist)
            {   
                //check password compare with password encrypt     
                let isMatch = await bcrypt.compare(password,isExist.password)
                if(!!isMatch){
                    
                    const user = await User.updateOne(
                        { _id: userId }, // Filter: Find the user with the given id
                        { $set: { 
                           status: 0
                         } } // Update: new pass
                      );
                    userData.errCode = 0;
                    userData.errMessage = 'Success';
                    resolve(userData);
                } else {
                    userData.errCode = 2;
                    userData.errMessage ='Wrong password'
                    resolve(userData)
                }
                resolve()
            }else{
                userData.errCode = 1;
                userData.errMessage ='Your account not exist'
                resolve(userData)
            }
        }catch(e){
            userData.errCode = 3;
            userData.errMessage ='Error connect'
            rejects(userData)
        }
    })
};
//function check id or email exist or no
export const checkExist = (text, types) =>{
    return new Promise( async (resolve, rejects)=>{
        let checks = false;
        try{
            if(types === 'id')
            {
                let isExist = await User.findOne({_id: text }).exec();
                if(isExist)
                {
                    checks = true;
                    resolve(checks);
                } else{
                    resolve(checks);
                }
            } else if (types === 'email')
            {
                let isExist = await User.findOne({email: text}).exec();  
                if(isExist)
                {
                    checks = true;
                    resolve(checks);
                } else{
                    resolve(checks);
                }
            }
        }catch(e){    
            checks = 0;          
            rejects(checks)
        }
    })
};
