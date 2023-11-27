
import jwt from "jsonwebtoken";
import {
    checkTokenExist
} from "../services/userService.js"
export default async function checkToken(req, res, next) {
    //bypass login, register, 
    if(req.url.toLowerCase().trim() == '/api/login'.toLowerCase().trim() 
        || req.url.toLowerCase().trim() =='/api/register'.toLowerCase().trim()
        || req.url.toLowerCase().trim() =='/api/logout'.toLowerCase().trim()
        || req.url.toLowerCase().trim() =='/'.toLowerCase().trim()
        || req.url.toLowerCase().trim() =='/api/filter-tour'.toLowerCase().trim()
        || req.url.toLowerCase().trim() =='/api/get-all-tours'.toLowerCase().trim()
        || req.url.toLowerCase().trim() =='/api/get-tour-by-id'.toLowerCase().trim()
        || req.url.toLowerCase().trim() =='/api/latest-tour'.toLowerCase().trim()
        || req.url.toLowerCase().trim() =='/api/hot-tour'.toLowerCase().trim()
        || req.url.toLowerCase().trim() =='/auth/login/success'.toLowerCase().trim()
        || req.url.toLowerCase().trim() =='/auth/login/failed'.toLowerCase().trim()
        || req.url.toLowerCase().trim() =='/auth/google/callback'.toLowerCase().trim()
        || req.url.toLowerCase().trim() =='/auth/logout'.toLowerCase().trim()
        
    ){
        next()
        return
    }
    const token = req.headers?.authorization?.split(" ")[1];
    try {
        const jwtObject = jwt.verify(token, process.env.JWT_SECRET)
        const isExpired = Date.now() >= jwtObject.exp * 1000
        if(isExpired)
        {
            res.status(400).json({
                errCode: 1,
                message: "token is expired",
            }) 
            res.end()
        }
        else{
            let checkToken = await checkTokenExist(token);
            if(checkToken)
            {
                next()
            }
            else {
                res.status(400).json({
                    errCode: 1,
                    message: "token is expired",
                }) 
                res.end()
            }
        }
        debugger
    }catch(e){
        res.status(400).json({
            errCode: 1,
            message: "Not match token",
        }) 
    }
}

