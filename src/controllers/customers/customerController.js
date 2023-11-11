

let getToursById = async (req,res) =>{
        return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
    }) 
}

module.exports ={
    handleLogin: handleLogin,
}