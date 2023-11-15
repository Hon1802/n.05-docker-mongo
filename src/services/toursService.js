import { Tour } from "../models/index.js"
export const handleAddNewTour = (description, name, region, category, duration, originalPrice, destination, status = 1) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            let isExist = await Tour.findOne({name}).exec();            
            if(isExist)
            {   
                tourData.status = 400;
                tourData.errCode = 1;
                tourData.errMessage ='Your tour was already exist'            
                resolve(tourData)
            }else{
                try {
                    //insert db
                    const newTour = await Tour.create({
                        name: name,
                        description:description,
                        region: region,
                        category: category,
                        destination: destination,
                        duration: duration,
                        originalPrice: originalPrice,
                        urlImageN1: 'none',
                        urlImageN2: 'none',
                        urlImageN3: 'none',
                        status : status,
                    })
                    tourData.status = 200;
                    tourData.errCode = 0;
                    tourData.errMessage ='Tour was create';
                    tourData.data = {
                        ...newTour._doc
                    }
                    resolve(tourData)
                } catch(e){
                    tourData.status = 400;
                    tourData.errCode = 2;
                    tourData.errMessage = 'Error when create'
                    resolve(tourData)
                }  
            }
        }catch(e){
            let tourData = {};
            tourData.status = 400;
            tourData.errCode = 3;
            tourData.errMessage ='Tour was not created'             
            resolve(tourData)
        }
    })
};
// not completed
// export const getAllProduct = async (page, size, searchString) =>{
//     //aggregate data 
//     page = parseInt(page)
//     size = parseInt(size)
//     let filteredProduct = await Product.aggregate([
//         {
//             $match:{
//                 $or:[
//                     {
//                         name: {
//                             $regex: `.*${searchString}.*`, $option:'i'
//                         },
//                         email: {
//                             $regex: `.*${searchString}.*`, $option:'i'
//                         }
//                     }
//                 ]
//             }
//         },
//         {
//             $skip: (page - 1) * size
//             // $skip: 0
//         },
//         {
//             $limit: size,
//             // $limit:5
//         }
        
//     ])
//     return filteredProduct
// }
export const handleUpdateTourById = (tourId, nameTour, description, destination, region, category, duration, originalPrice, status = 1) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            if(checkExist(tourId))
            {
                const tour = await Tour.updateOne(
                    { _id: tourId }, // Filter: Find the user with the given id
                    { $set: { 
                        name: nameTour,
                        description:description,
                        region: region,
                        category: category,
                        destination: destination,
                        duration: duration,
                        originalPrice: originalPrice,
                        status : status,
                     } } // Update: Set the urlAvatar field to the new path
                  );
                if (tour.nModified === 0) {
                // If no user was modified, it means the user with the given id was not found
                    tourData.status = 400;
                    tourData.errCode = 4;
                    tourData.errMessage = 'User not found';
                    resolve(tourData);
                }
                tourData.status = 200;
                tourData.errCode = 0; // Assuming 0 means success
                tourData.errMessage = 'Uploaded successfully';
                resolve(tourData);
            } else{
                console.log('no1111')
            }
        }catch(e){
            let tourData= {};
            tourData.status = 400;
            tourData.errCode = 3;
            tourData.errMessage ='Your account was not created';             
            resolve(tourData);
        }
    });
};

//upload images
export const uploadImages = (paths, idTour) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            const tour = await Tour.updateOne(
                { _id: idTour }, // Filter: Find the tour with the given id
                { 
                    $set: { 
                    urlImageN1 : paths[0],
                    urlImageN2 : paths[1],
                    urlImageN3: paths[2] 
                    } 
                } // Update: Set the urlAvatar field to the new path
              );
            if (tour.nModified === 0) {
            // If no tour was modified, it means the tour with the given id was not found
                tourData.status = 400;
                tourData.errCode = 4;
                tourData.errMessage = 'Tour not found';
                resolve(tourData);
            }
            tourData.status = 200;
            tourData.errCode = 0; // Assuming 0 means success
            tourData.errMessage = 'Tour uploaded successfully';
            resolve(tourData);
        }catch(e){  
            let tourData ={};
            tourData.status = 400; 
            tourData.errCode = 3;
            tourData.errMessage ='Error uploading tour Images'             
            resolve(tourData)
        }
    })
};

//update status [0,1]
export const changeStatusTour = (tourId, status) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            let isExist = await Tour.findOne({_id: tourId }).exec();
            if(isExist)
            {   
                const tour = await Tour.updateOne(
                    { _id: tourId }, // Filter: Find the tour with the given id
                    { $set: { 
                        status: status
                        } } // Update:
                    );
                tourData.status = 200;
                tourData.errCode = 0;
                tourData.errMessage = 'Success';
                resolve(tourData);
                
            }else{
                tourData.status = 400;
                tourData.errCode = 1;
                tourData.errMessage ='Your tour select not exist'
                resolve(tourData)
            }
        }catch(e){
            let tourData = {};
            tourData.status = 400;
            tourData.errCode = 3;
            tourData.errMessage ='Error connect'
            resolve(tourData)
        }
    })
};
// get by id
export const handleGetTourById = (tourId) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            let isExist = await Tour.findOne({_id: tourId }).exec()        
            if(isExist)
            {   
                tourData.status = 200;
                tourData.errCode = 2;
                tourData.errMessage ='Get tour by id success';
                tourData.data = {
                    ...isExist.toObject()
                }
                resolve(tourData)
            }else{
                tourData.status = 400;
                tourData.errCode = 3;
                tourData.errMessage ='Error connect'
                resolve(tourData) 
            }
        }catch(e){
            let tourData = {};
            tourData.status = 400;
            tourData.errCode = 3;
            tourData.errMessage ='Your tour was not created'             
            resolve(tourData)
        }
    })
};
//get all tour
export const handleGetAllTour = (tourId) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            let tours = await Tour.find().exec();        
            if(tours)
            {   
                tourData.status = 200;
                tourData.errCode = 2;
                tourData.errMessage ='Get tour by id success';
                tourData.data = tours.map(tour => tour.toObject());
                resolve(tourData)
            }else{
                tourData.status = 400;
                tourData.errCode = 3;
                tourData.errMessage ='Error connect'
                resolve(tourData) 
            }
        }catch(e){
            let tourData = {};
            tourData.status = 400;
            tourData.errCode = 3;
            tourData.errMessage ='Your account was not created'             
            resolve(tourData)
        }
    })
};
//function for filter
export const handleFilter = (region, category, maximumPrice, minimumPrice, duration, from, to, name) =>{ 
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            let query = Tour.find();
            // region
            if (region) {
                query = query.where('region').equals(region);
            }   
            // category
            if (category) {
                query = query.where('category').equals(category);
            }      
            // maximum price
            if (maximumPrice) {
                query = query.where('originalPrice').lte(parseInt(maximumPrice));
            }
            // minimum price
            if (minimumPrice) {
                query = query.where('originalPrice').gte(parseInt(minimumPrice));
            }
            // duration
            if (duration) {
                query = query.where('duration').equals(parseInt(duration));
            }
            // time
            if (from && to) {
                query = query.where('date').gte(new Date(from)).lte(new Date(to));
            }
            // name
            if (name) {
                query = query.where('name', new RegExp(name, 'i'));
            }
            const result = await query.exec(); // result not object, so need to transform to object
            const resultsArray = Array.isArray(result) ? result : [result];
            const transformedResults = resultsArray.map(item => item.toObject());
            tourData.data = transformedResults;
            tourData.status = 200;
            tourData.errCode = 0;
            tourData.errMessage ='Success'
            resolve(tourData) 
            
        }catch(e){
            let tourData = {};
            tourData.status = 400;
            tourData.errCode = 3;
            tourData.errMessage ='Error exe'             
            resolve(tourData)
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
                let isExist = await Tour.findOne({_id: text }).exec();
                if(isExist)
                {
                    checks = true;
                    resolve(checks);
                } else{
                    resolve(checks);
                }
            } 
            if (types === 'name')
            {
                let isExist = await Tour.findOne({name: text }).exec();
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
