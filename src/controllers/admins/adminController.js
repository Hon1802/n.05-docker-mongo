import { MAX_RECORDS } from "../../global/constants.js"
const productService = require("../../services/productService.js") ;
//manage customer
let getAllCustomer = async (req,res) =>{
    let {page = 1 , size = MAX_RECORDS , searchString=''}=req.query
    size = size >= MAX_RECORDS ? MAX_RECORDS : size
    try {
        let filteredProduct = await productService.getAllProduct({
                size, page, searchString
            })
            return res.status(200).json({
                errCode: 1,
                size: filteredProduct.length, 
                page,
                message: filteredProduct
                
            })  
    }catch(e)
    {
        return res.status(200).json({
            errCode: 0,
            message: "Can't get "
            
        })  
    }
    
}

let getCustomerById = async (req,res) =>{

    let productId = req.params.id;
    try {
        const product = await productService.getProductById(productId)
        return res.status(200).json({
            errCode: 1,
            message: filteredProduct,
            data: product            
        })  
    }catch(e)
    {
        return res.status(200).json({
            errCode: 0,
            message: "Can't get "
            
        })  
    }
}

let editCustomer = async (req,res) =>{
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
    }) 
}

let deleteCustomer = async (req,res) =>{
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
    }) 
}

//Statistical
let statisticalByDay = async (req,res) =>{
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
    }) 
}

let statisticalByWeek = async (req,res) =>{
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
    }) 
}

let statisticalByMon = async (req,res) =>{
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
    }) 
}

module.exports ={
    getAllCustomer:getAllCustomer,
    getCustomerById:getCustomerById,
    editCustomer:editCustomer,
    deleteCustomer:deleteCustomer,
    statisticalByDay:statisticalByDay, 
    statisticalByWeek:statisticalByWeek,
    statisticalByMon:statisticalByMon
}