import { Ticket, Tour } from "../models/index.js"
import { utcToZonedTime } from 'date-fns-tz'
const now = new Date();
// Lấy thời gian hiện tại và chuyển về múi giờ mong muốn
export const handleAddNewTour = (
    name, 
    description, 
    destination, 
    districtDes,
    region, 
    duration, 
    durationType,
    pickUp,
    childPrice, 
    adultPrice, 
    openTime,
    closeTime,
    status = 1,
    url1 = 'none',
    url2 = 'none',
    url3 = 'none') =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            let isExist = await Tour.findOne({name}).exec();            
            if(isExist)
            {   
                tourData.status = 400;
                tourData.errCode = 1;
                tourData.errMessage ='Exist, try again with another name'            
                console.log('try again with another name')
                resolve(tourData)
            }else{
                try {
                    //insert db
                    const newTour = await Tour.create({                        
                        name: name,
                        description:description, 
                        destination: destination,
                        districtDes: districtDes,
                        region: region,
                        duration: duration,
                        durationType: durationType,
                        pickUp: pickUp,
                        openTime : openTime,
                        closeTime : closeTime,
                        childPrice: childPrice, 
                        adultPrice: adultPrice, 
                        images: [{
                        urlImage: url1
                        },{
                        urlImage: url2
                        },
                        {
                        urlImage: url3
                        },
                        ],
                        status : status,
                    })
                    tourData.status = 200;
                    tourData.errCode = 0;
                    tourData.errMessage ='Tour was create';
                    tourData.data = {
                        ...newTour._doc
                    }
                    console.log('Tour was create')
                    resolve(tourData)
                } catch(e){
                    tourData.status = 400;
                    tourData.errCode = 2;
                    tourData.errMessage = 'Error when create'
                    console.log('Error when create', e)
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

// Lấy thời gian hiện tại và chuyển về múi giờ mong muốn
export const handleUpdateTourWithPlan = (
    tourId,
    plan,
    ) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            if(checkExist(tourId))
            {
                const tour = await Tour.updateOne(
                    { _id: tourId }, // Filter: Find the user with the given id
                    { $set: { 
                        plan: plan
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
            let tourData = {};
            tourData.status = 400;
            tourData.errCode = 3;
            tourData.errMessage ='Tour was not created'             
            resolve(tourData)
        }
    })
};
export const handleUpdateTourById = (
    tourId, 
    description, 
    destination, 
    districtDes,
    region, 
    duration, 
    durationType,
    pickUp,
    childPrice, 
    adultPrice, 
    openTime,
    closeTime,
    status = 1) =>{
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
                        destination: destination,
                        districtDes: districtDes,
                        region: region,
                        destination: destination,
                        duration: duration,
                        durationType: durationType,
                        childPrice: childPrice, 
                        adultPrice: adultPrice,
                        pickUp: pickUp,
                        openTime : openTime,
                        closeTime : closeTime,
                        updatedAt : utcToZonedTime(now, 'Asia/Ho_Chi_Minh'),
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
            
            const newPaths = paths.map((path) => {
                return { urlImage: path};
            });
          
            const tour = await Tour.updateOne(
                { _id: idTour }, // Filter: Find the tour with the given id
                { 
                    $set: { 
                        images:newPaths, 
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
                console.log(tours.map(tour => tour.toObject()))
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
export const handleFilter = (
    from, 
    to, 
    region, 
    duration, 
    budget, 
    name) =>{ 
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            let query = Tour.find();
            let queryDate = Tour.find();
            //
            // region
            if (region) {
                // query = query.where('region').equals(region);
                query = query.where('region', new RegExp(region, 'i'));
            }          
            // maximum price
            if (budget) {
                query = query.where('adultPrice').lte(parseInt(budget));
            }
            // duration
            if (duration) {
                query = query.where('durationType', new RegExp(duration, 'i'));
            }
            // name
            if (name) {
                query = query.where('name', new RegExp(name, 'i'));
            }
            // time
            if (from ) {
                query = query.where('pickUp', new RegExp(from, 'i'));
                if(to)
                {
                    query = query.where('districtDes', new RegExp(to, 'i'));
                }
                let result = await query.exec(); // result not object, so need to transform to object
                let resultsArray = Array.isArray(result) ? result : [result];
                let transformedResults = resultsArray.map(item => item.toObject());
                tourData.data = transformedResults;
                tourData.status = 200;
                tourData.errCode = 0;
                tourData.errMessage ='Success'
                resolve(tourData) 
            } else{
                let result = await query.exec(); // result not object, so need to transform to object
                let resultsArray = Array.isArray(result) ? result : [result];
                let transformedResults = resultsArray.map(item => item.toObject());
                tourData.data = transformedResults;
                tourData.status = 200;
                tourData.errCode = 0;
                tourData.errMessage ='Success'
                resolve(tourData) 
            }
        }catch(e){
            let tourData = {};
            tourData.status = 400;
            tourData.errCode = 3;
            tourData.errMessage ='Error when filter'             
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


//function
export const getLastTour = () =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            const recentTours = await Tour.find()
            .sort({updateAt: -1 }) // Sắp xếp theo trường updatedAt giảm dần (ngày gần nhất đến xa nhất)
            .limit(5); // Giới hạn kết quả trả về thành 5 đối tượng
            const modifiedTours = recentTours.map(tour => {
                return {
                    ...tour.toObject(),
                    urlImageN1: 'newValue' // Thay 'newField' và 'newValue' bằng tên và giá trị bạn muốn thêm
                };
            });
            tourData.data = modifiedTours;
            tourData.status = 200;
            tourData.errCode = 0;
            tourData.errMessage ='Success'             
            resolve(tourData)
        }catch(e){
            let tourData = {};
            tourData.data =[];
            tourData.status = 400;
            tourData.errCode = 3;
            tourData.errMessage ='Error exe'             
            resolve(tourData)
        }
    })
}