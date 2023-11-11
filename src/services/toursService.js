import { Tour } from "../models/index.js"
export const handleAddNewTour = (description, name, types, status) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            let isExist = await Tour.findOne({name}).exec();            
            if(isExist)
            {   
                tourData.errCode = 1;
                tourData.errMessage ='Your tour was already exist'            
                resolve(tourData)
            }else{
                try {
                    //insert db
                    const newTour = await Tour.create({
                        name: name,
                        description:description,
                        type: types,
                        urlImageN1: 'none',
                        urlImageN2: 'none',
                        urlImageN3: 'none',
                        status : '1',
                    })
                    tourData.errCode = 0;
                    tourData.errMessage ='Tour was create';
                    tourData.data = {
                        ...newTour._doc
                    }
                    resolve(tourData)
                } catch(e){
                    tourData.errCode = 2;
                    tourData.errMessage = e
                    resolve(tourData)
                }  
            }
        }catch(e){
            tourData.errCode = 3;
            tourData.errMessage ='Tour was not created'             
            rejects(tourData)
        }
    })
};



export const getProductById = async (productId) =>{
    const product = await Product.findById(productId)

    if(!product){
        //exception can't get product 
    }

    return product ?? {}
}

export const getAllProduct = async (page, size, searchString) =>{
    //aggregate data 
    page = parseInt(page)
    size = parseInt(size)
    let filteredProduct = await Product.aggregate([
        {
            $match:{
                $or:[
                    {
                        name: {
                            $regex: `.*${searchString}.*`, $option:'i'
                        },
                        email: {
                            $regex: `.*${searchString}.*`, $option:'i'
                        }
                    }
                ]
            }
        },
        {
            $skip: (page - 1) * size
            // $skip: 0
        },
        {
            $limit: size,
            // $limit:5
        }
        
    ])
    return filteredProduct
}

export const updateProductById = async (id, name, address) =>{

    const product = await Product.findById(id)

    try{
        product.name = name ?? product.name
        product.address = address ?? product.address
        await product.save()
        return product
    }catch(e)
    {
        return res.status(200).json({
            errCode: 0,
            message: "not update",
            }) 
    }
}

export const deleteProductById = async (req,res) =>{
    return res.status(200).json({
    errCode: userData.errCode,
    message: userData.message,
    }) 
}

//upload images
export const uploadImages = (paths, idTour) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            const tour = await Tour.updateOne(
                { _id: idTour }, // Filter: Find the user with the given id
                { 
                    $set: { 
                    urlImageN1 : paths[0],
                    urlImageN2 : paths[1],
                    urlImageN3: paths[2] 
                    } 
                } // Update: Set the urlAvatar field to the new path
              );
            if (tour.nModified === 0) {
            // If no user was modified, it means the user with the given id was not found
                tourData.errCode = 404;
                tourData.errMessage = 'Tour not found';
                resolve(tourData);
            }

            tourData.errCode = 0; // Assuming 0 means success
            tourData.errMessage = 'Tour uploaded successfully';
            resolve(tourData);
        }catch(e){   
            tourData.errCode = 3;
            tourData.errMessage ='Error uploading tour Images'             
            rejects(tourData)
        }
    })
};