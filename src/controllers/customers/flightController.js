import {
    getToken,
    handleGetAllAirport,
    getCodeByCity
} from "../../services/amadeusService.js" ;
import {descriptions} from '../../global/constants.js'
import fs from 'fs'
import axios from "axios";
let globalAccessToken = '';
export const getListFlight = async (req, res) =>{
    let originLocation = req.body.originLocationCode;
    if(originLocation)
    {
        originLocation = originLocation.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    let originLocationCode = await getCodeByCity(originLocation);
    let destinationLocation = req.body.destinationLocationCode;
    if(destinationLocation)
    {
        destinationLocation = destinationLocation.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    let destinationLocationCode = await getCodeByCity(destinationLocation);
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
        // console.log(response);
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
        // console.error('Error fetching Access Token:', error);
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
    let city = req.body.cityCode;
    if(city)
    {
        city = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    let cityCode = await getCodeByCity(city);
    console.log(cityCode);
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
    // console.log(accToken)
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
        // limit 15 record
        // const dataResponse = response.data.data.slice(0, 15);
        const dataResponse = response.data.data;
        dataResponse.forEach((hotel, index) => {
            let random = Math.floor(Math.random() * 20) + 1;
            let urlImage = 'src/public/imageHotel/'+random+'.jpg';
            hotel.image = fs.readFileSync(urlImage, {encoding: 'base64'});
            hotel.description = descriptions[random];
          });
        let flightData = dataResponse;
        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: flightData
        }) 
    } catch (error) {
        // console.error('Error fetching Access Token:', error);
        return res.status(400).json({
            errCode: 1,
            message: 'There are no partner hotels at this location',
        }) 
    }
}

export const getHotelOfferSearch = async (req, res) =>{
    let hotelId = req.body.hotelIds;
    console.log(hotelId);
    let adults = req.body.adults;
    let checkInDate = req.body.checkInDate;
    let checkOutDate = req.body.checkOutDate;
    let currency = req.body.currency;
    let hotelIds = "MCLONGHM";
    
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
    //
    let HotelIn = await getInforHotelById(hotelId, accToken);
    // console.log(accToken)
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
        let flightData = response.data;
        const updatedHotelData = flightData.data.map((hotel) => {
            let random = Math.floor(Math.random() * 20) + 1;
            let urlImage = 'src/public/imageHotel/'+random+'.jpg';
            hotel.hotel.hotelId = HotelIn[0].hotelId,
            hotel.hotel.chainCode = HotelIn[0].chainCode,
            hotel.hotel.dupeId = HotelIn[0].dupeId,
            hotel.hotel.name = HotelIn[0].name,
            hotel.hotel.cityCode = HotelIn[0].cityCode,
            hotel.hotel.latitude = HotelIn[0].latitude,
            hotel.hotel.longitude = HotelIn[0].longitude,
            hotel.hotel.image = fs.readFileSync(urlImage, {encoding: 'base64'});
            hotel.hotel.description = descriptions[random];
            return hotel;
          });
        //   console.log(flightData);
        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: flightData
        }) 
    } catch (error) {
        // console.error('Error fetching Access Token:', error);
        return res.status(400).json({
            errCode: 1,
            message: 'Not found',
        }) 
    }
}

const getInforHotelById = async (idHotel, accessToken)=>{
    let urlText = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-hotels?hotelIds=`+idHotel;
    var config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: urlText,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Accept': 'application/json',
            'authorization': `Bearer ${accessToken}`
            }
    };
    try {
        const response = await axios(config);
        const dataResponse = response.data.data;
        return dataResponse;
       
    } catch (error) {
        // console.error('Error fetching Access Token:', error);
        let message = 'error';
        return message;
    }

}