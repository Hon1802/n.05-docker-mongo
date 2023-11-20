import { Ticket, Tour } from "../models/index.js"
import { utcToZonedTime } from 'date-fns-tz'
const now = new Date();
// Lấy thời gian hiện tại và chuyển về múi giờ mong muốn
export const handleAddNewTour = (
    name, 
    description, 
    destination, 
    region, 
    duration, 
    displayPrice,
    childPrice, 
    adultPrice, 
    status = 1) =>{
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
                        region: region,
                        duration: duration,
                        displayPrice: displayPrice,
                        childPrice: childPrice, 
                        adultPrice: adultPrice, 
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

export const handleUpdateTourById = (
    tourId, 
    nameTour, 
    description, 
    destination, 
    region, 
    duration, 
    displayPrice,
    childPrice, 
    adultPrice, 
    departureTime,
    returnTime,
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
                        region: region,
                        destination: destination,
                        duration: duration,
                        displayPrice: displayPrice,
                        childPrice: childPrice, 
                        adultPrice: adultPrice,
                        departureTime : departureTime,
                        returnTime : returnTime,
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
export const handleFilter = (
    region,  
    maximumPrice, 
    minimumPrice, 
    duration, 
    from, 
    to, 
    name) =>{ 
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            let query = Tour.find();
            let queryDate = Tour.find();
            //
            // region
            if (region) {
                query = query.where('region').equals(region);
            }          
            // maximum price
            if (maximumPrice) {
                query = query.where('displayPrice').lte(parseInt(maximumPrice));
            }
            // minimum price
            if (minimumPrice) {
                query = query.where('displayPrice').gte(parseInt(minimumPrice));
            }
            // duration
            if (duration) {
                query = query.where('duration').equals(parseInt(duration));
            }
            
            // name
            if (name) {
                query = query.where('name', new RegExp(name, 'i'));
            }
    
            // time
            if (from ) {
                
                if(!to)
                {
                    // to = new Date();
                    const currentDate = new Date();
                    to = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(currentDate);
                    // let newTo = new Date(to + 1 * 24 * 60 * 60 * 1000);
                }
                
                // console.log(newTo)
                queryDate = query.where('departureTime').gte(new Date(from)).lte(new Date(to));
                let resultDate = await queryDate.exec(); // result not object, so need to transform to object
                let resultsArray = Array.isArray(resultDate) ? resultDate : [resultDate];
                let transformedResults = resultsArray.map(item => item.toObject());
                if(transformedResults.length === 0) {
                    tourData.status = 200;
                    tourData.data = [];
                    tourData.errCode = 0;
                    tourData.errMessage ='Success'
                    resolve(tourData) 
                } else{
                    transformedResults.forEach(result => {
                        // category
                        query = query.where('_id').equals(result._id);
                        console.log('Transformed Result idTour:', result._id);
                        tourData.data = transformedResults;
                        tourData.status = 200;
                        tourData.errCode = 0;
                        tourData.errMessage ='Success'
                        resolve(tourData) 
                    });
                }
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


//function
export const getLastTour = () =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let tourData = {};
            const recentTours = await Tour.find()
            .sort({updateAt: -1 }) // Sắp xếp theo trường updatedAt giảm dần (ngày gần nhất đến xa nhất)
            .limit(5); // Giới hạn kết quả trả về thành 5 đối tượng
            tourData.data = recentTours;
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