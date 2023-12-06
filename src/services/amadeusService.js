import { Flight } from "../models/index.js";
import axios from 'axios';

export const handleAddNewFlight = (
   airport,
   code_flight,
   district,
   status=1) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            try {
                //insert db
                const newTour = await Flight.create({                        
                    airport: airport,
                    code_flight: code_flight,
                    district: district,
                    status : status,
                })
                console.log('Tour was create');
            } catch(e){
                console.log('Error when create', e)
            }    
        }catch(e){
            console.log('Flight was not created');             
        }
    })
};
export const getToken = async ()=>{
    const clientId = 'GLugKv0PGNPXsp7A06bTixksoG8tXbfG';
    const clientSecret = 'mmqGevvGG8L4I20p';
    const response_type = 'client_credentials';
    let urlText = `https://test.api.amadeus.com/v1/security/oauth2/token`;
    
    var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: urlText,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Accept': 'application/json'
            },
        data :{
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "client_credentials",
        }
    };
    // console.log(urlText)
    try {
        const response = await axios(config);
        const accessToken = response.data.access_token;
        // console.log('Access Token:', accessToken);
        // 
        return accessToken;
    } catch (error) {
        console.error('Error fetching Access Token:', error);
    }
}

export const handleGetAllAirport = (tourId) =>{
    return new Promise( async (resolve, rejects)=>{
        try{
            let flightData = {};
            let flight = await Flight.find().exec();        
            if(flight)
            {   
                flightData.status = 200;
                flightData.errCode = 2;
                flightData.errMessage ='Get success';
                flightData.data = flight.map(tour => tour.toObject());
                // console.log(flight.map(tour => tour.toObject()))
                resolve(flightData)
            }else{
                flightData.status = 400;
                flightData.errCode = 3;
                flightData.errMessage ='Error connect'
                resolve(flightData)  
            }
        }catch(e){
            let flightData = {};
            flightData.status = 400;
            flightData.errCode = 3;
            flightData.errMessage ='Your Flight Not Found'             
            resolve(flightData)
        }
    })
};

//function for filter
export const handleGetAirport = () =>{ 
    return new Promise( async (resolve, rejects)=>{
        try{
            let flightData = {};
            let query = Tour.find();
            query = query.where('region', new RegExp(region, 'i'));
            let result = await query.exec(); // result not object, so need to transform to object
            let resultsArray = Array.isArray(result) ? result : [result];
            let transformedResults = resultsArray.map(item => item.toObject());
            flightData.data = transformedResults;
            flightData.status = 200;
            flightData.errCode = 0;
            flightData.errMessage ='Success'
            resolve(flightData) 
            
        }catch(e){
            let tourData = {};
            tourData.status = 400;
            tourData.errCode = 3;
            tourData.errMessage ='Error when get'             
            resolve(tourData)
        }
    })
};

export const getCodeByCity = (city) =>{
    return new Promise( async (resolve, rejects)=>{
        let codeCity = '';
        try{
            let query = Flight.find();
            if(!city)
            {
                city = 'Ho Chi Minh';
            }
            query = query.where('district', new RegExp(city, 'i'));
            let result = await query.exec();
            let resultsArray = Array.isArray(result) ? result : [result];
            let transformedResults = resultsArray.map(item => item.toObject());
            console.log(transformedResults[0].code_flight);
            resolve(transformedResults[0].code_flight) 
           
        }catch(e){    
            codeCity = '';          
            resolve(codeCity);
        }
    })
}