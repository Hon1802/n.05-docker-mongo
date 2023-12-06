import {
    getToken,
    handleGetAllAirport,
    getCodeByCity
} from "../../services/amadeusService.js" ;
import {descriptions, amenities, exchangeRates} from '../../global/constants.js'
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
        if(destinationLocation == "Đa Nang"){
            destinationLocation = "Da Nang";
        }
    }
    console.log(destinationLocation)
    let destinationLocationCode = await getCodeByCity(destinationLocation);
    console.log(destinationLocationCode)
    let departureDate = req.body.departureDate;
    let returnDate = req.body.returnDate;
    let adults = req.body.adults;
    let max = req.body.max;
    if(!max){
        max = 5;
    }
    let accToken = '';
    if(globalAccessToken){
        // console.log('old token');
        accToken = globalAccessToken;
    } else { 
        // console.log('new token');
        globalAccessToken = await getToken();
        accToken = globalAccessToken;
    }
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
        let flightData = response.data;
        let dataLength = flightData.data.length;
        let modifiedData =[];
        function convertToVND(amount, currency) {
            if (exchangeRates[currency]) {
                return amount * exchangeRates[currency];
            } else {
                return null; // Trả về null nếu không có tỷ giá hối đoái cho đơn vị tiền tệ được cung cấp
            }
        }
        for (let i = 0; i < dataLength; i++)
        {
            let itinerary = flightData.data[i].itineraries;
            let priceTravel = flightData.data[i].price;
            let travelerPricings = flightData.data[i].travelerPricings;
            //
            let classDeparture = travelerPricings[0].fareDetailsBySegment[1];
            let departure = itinerary[0].segments[0].departure.iataCode;
            let arrival = itinerary[1].segments[0].departure.iataCode;
            let numberDeparture = itinerary[0].segments[0].carrierCode + ' - ' +itinerary[0].segments[0].number ;
            let numberArrival = itinerary[1].segments[0].carrierCode + ' - ' +itinerary[1].segments[0].number ;
            let round1 = departure + '-->' +arrival;
            let round2 = arrival + '-->' + departure;
            let durationRound1 = itinerary[0].duration;
            let durationRound2 = itinerary[1].duration;
            let timeRound1 = itinerary[0].segments[0].departure.at;
            let timeRound2 = itinerary[1].segments[0].departure.at;
            let { base, fees, grandTotal, ...priceInfo } = priceTravel;
            priceInfo.total = convertToVND(priceInfo.total, priceInfo.currency);
            priceInfo.currency = 'VND'
            priceInfo.total.toFixed(3);
            modifiedData.push({
                round1: round1,
                duration1: durationRound1,
                timeRound1: timeRound1,
                numberDeparture: numberDeparture,
                timeRound2:timeRound2,
                round2: round2,
                duration2: durationRound2,
                numberArrival:numberArrival,
                classDeparture: classDeparture,
                priceInfo: priceInfo,
            });
        // 
        }
        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: modifiedData
        }) 
    } catch (error) {
        // console.error('Error fetching Access Token:', error);
        let flightData = '[{}]';
        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: flightData
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
    let accToken = '';
    if(globalAccessToken){
        // console.log('old token');
        accToken = globalAccessToken;
    } else { 
        // console.log('new token');
        globalAccessToken = await getToken();
        accToken = globalAccessToken;
    }
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
        let flightData = '[{}]';
        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: flightData
        }) 
    }
}

export const getHotelOfferSearch = async (req, res) =>{
    let hotelId = req.body.hotelIds;
    let adults = req.body.adults;
    let checkInDate = req.body.checkInDate;
    let checkOutDate = req.body.checkOutDate;
    let hotelIds = "MCLONGHM";
    let currency = 'USD';
    let accToken = '';
    if(globalAccessToken){
        // console.log('old token');
        accToken = globalAccessToken;
    } else { 
        // console.log('new token');
        globalAccessToken = await getToken();
        accToken = globalAccessToken;
    }
    //
    let HotelIn = await getInforHotelById(hotelId, accToken);
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
        function getRandomElementsFromArray(arr, n) {
            const shuffled = arr.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, n);
          }
        const updatedHotelData = flightData.data.map((hotel) => {
            let random = Math.floor(Math.random() * 20) + 1;
            let urlImage = 'src/public/imageHotel/'+random+'.jpg';
            let totalPrice = hotel.offers[0].price.total * 30.622
            let basePrice = hotel.offers[0].price.base * 30.622
            hotel.hotel.hotelId = HotelIn[0].hotelId,
            hotel.hotel.chainCode = HotelIn[0].chainCode,
            hotel.hotel.dupeId = HotelIn[0].dupeId,
            hotel.hotel.name = HotelIn[0].name,
            hotel.hotel.cityCode = HotelIn[0].cityCode,
            hotel.hotel.latitude = HotelIn[0].latitude,
            hotel.hotel.longitude = HotelIn[0].longitude,
            hotel.offers[0].price.variations = '',
            hotel.offers[0].price.currency = 'VND',
            hotel.offers[0].price.base = basePrice.toFixed(3);
            hotel.offers[0].price.total = totalPrice.toFixed(3);
            // hotel.hotel.image = fs.readFileSync(urlImage, {encoding: 'base64'});
            hotel.hotel.description = descriptions[random];
            hotel.hotel.amenities = getRandomElementsFromArray(amenities, 8);
            console.log(hotel.offers[0].price.total * 30622.90);
            return hotel;
          });
        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: flightData
        }) 
    } catch (error) {
        // console.error('Error fetching Access Token:', error);
        let flightData = '[{}]';
        return res.status(200).json({
            errCode: 0,
            message: 'Success',
            data: flightData
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