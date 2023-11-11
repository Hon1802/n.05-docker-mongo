
import jwt from "jsonwebtoken";
export default function checkToken(req, res, next) {
    //bypass login, register, 
    if(req.url.toLowerCase().trim() == '/api/login'.toLowerCase().trim() 
        || req.url.toLowerCase().trim() =='/api/register'.toLowerCase().trim()
        || req.url.toLowerCase().trim() =='/'.toLowerCase().trim()
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
            res.status(200).json({
                errCode: 1,
                message: "token is expired",
            }) 
            res.end()
        }
        else{
            next()
        }
        debugger
    }catch(e){
        res.status(200).json({
            errCode: 1,
            message: "Not match token",
        }) 
    }
}

