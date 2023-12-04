import {
    getToken,
    handleGetAllAirport
} from "../../services/amadeusService.js" ;
import axios from "axios";
let globalAccessToken = '';
export const getListFlight = async (req, res) =>{
    let originLocationCode = req.body.originLocationCode;
    let destinationLocationCode = req.body.destinationLocationCode;
    let departureDate = req.body.departureDate;
    let returnDate = req.body.returnDate;
    let adults = req.body.adults;
    let max = req.body.max;
    if(!max){
        max = 5;
    }
    let accToken = '';
    if(globalAccessToken){
        console.log('1');
        accToken = globalAccessToken;
    } else { 
        console.log('2');
        // console.log(await getToken());
        globalAccessToken = await getToken();
        accToken = globalAccessToken;
    }
    console.log(accToken)
    let urlText = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=`+originLocationCode+`&destinationLocationCode=`+destinationLocationCode+`&departureDate=`+departureDate+`&returnDate=`+returnDate+`&adults=`+adults+`&max=`+max;
    
    var config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: urlText,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Accept': 'application/json',
            'authorization': `Bearer ${accToken}`
            }
    };
    try {
        const response = await axios(config);
        console.log(response);
        let flightData = response.data;
        // console.log('Access Token:', accessToken);
        const convertEURtoVND = (eurAmount) => {
            const exchangeRate = 28000; 
            return eurAmount * exchangeRate;
        };
        let dataLength = flightData.data.length;
        for (let i = 0; i < dataLength; i++)
        {
            let firstFlightOffer = flightData.data[i];
            if (firstFlightOffer.price.currency === "EUR") {
                const eurPrice = parseFloat(firstFlightOffer.price.total);
                const vndPrice = convertEURtoVND(eurPrice).toFixed(2); 
                firstFlightOffer.price.currency = "VND";
                firstFlightOffer.price.total = vndPrice.toString();
            }
        }
        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: flightData
        }) 
    } catch (error) {
        console.error('Error fetching Access Token:', error);
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}
export const getAirport = async (req,res)=>{
    let flightData = await handleGetAllAirport();
    return res.status(flightData.status).json({
        errCode: flightData.errCode,
        message: flightData.message,
        flightData
    }) 
}

//hotel
export const getListHotelByCity = async (req, res) =>{
    let cityCode = req.body.cityCode;
    
    let accToken = '';
    if(globalAccessToken){
        console.log('1');
        accToken = globalAccessToken;
    } else { 
        console.log('2');
        // console.log(await getToken());
        globalAccessToken = await getToken();
        accToken = globalAccessToken;
    }
    console.log(accToken)
    let urlText = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=`+cityCode;
    
    var config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: urlText,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Accept': 'application/json',
            'authorization': `Bearer ${accToken}`
            }
    };
    try {
        const response = await axios(config);
        console.log(response);
        let flightData = response.data;
        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: flightData
        }) 
    } catch (error) {
        console.error('Error fetching Access Token:', error);
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}

export const getHotelOfferSearch = async (req, res) =>{
    let hotelIds = req.body.hotelIds;
    let adults = req.body.adults;
    let checkInDate = req.body.checkInDate;
    let checkOutDate = req.body.checkOutDate;
    let currency = req.body.currency;
    hotelIds = "MCLONGHM";
    
    let accToken = '';
    if(globalAccessToken){
        console.log('1');
        accToken = globalAccessToken;
    } else { 
        console.log('2');
        // console.log(await getToken());
        globalAccessToken = await getToken();
        accToken = globalAccessToken;
    }
    console.log(accToken)
    // let urlText = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=`+hotelIds+`&adults=`+adults;
    // let urlText = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=`+hotelIds+`&checkInDate=`+checkInDate+`&checkOutDate=`+checkInDate+`&currency=`+currency+`&adults=`+adults;
    let urlText = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=`+hotelIds+`&checkInDate=`+checkInDate+`&checkOutDate=`+checkOutDate+`&currency=`+currency+`&adults=`+adults;
    var config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: urlText,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Accept': 'application/json',
            'authorization': `Bearer ${accToken}`
            }
    };
    try {
        const response = await axios(config);
        console.log(response);
        let flightData = response.data;
        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: flightData
        }) 
    } catch (error) {
        console.error('Error fetching Access Token:', error);
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}