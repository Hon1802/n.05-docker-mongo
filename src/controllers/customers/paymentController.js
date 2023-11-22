//payment
import paypal from 'paypal-rest-sdk'
import axios from 'axios';
import {handleAddNewPayment} from '../../services/paymentService.js'
import {handleAddNewBooking} from '../../services/bookingService.js'

export const handleBooking = async (req, res) =>{
    let tourId = req.body.tourId;
    let userId = req.body.userId;
    let paymentId = req.body.paymentId;
    let arrayChild = req.body.arrayChild;
    let arrayAdult = req.body.arrayAdult;
    let totalPrice = req.body.totalPrice;
    if(arrayChild)
    {
        arrayChild = JSON.parse(arrayChild);
    }
    if(arrayAdult) 
    {
        arrayAdult = JSON.parse(arrayAdult);
    }
    let nTicketChild = arrayChild ? arrayChild.length : 0;
    let nTicketAdult = arrayAdult ? arrayAdult.length : 0;
    let status = 1;
    let checkVerify = await handleCheckBooking(tourId, userId, paymentId, totalPrice, req, res);
    if(checkVerify) 
    {
      let userData = await handleAddNewBooking(tourId, 
                                                userId,
                                                paymentId,
                                                arrayChild,
                                                arrayAdult, 
                                                nTicketChild,
                                                nTicketAdult,
                                                status); 
        return res.status(userData.status).json({
          errCode: userData.errCode,
          message: userData.errMessage,
          userData
      })
    }else{
      return res.status(400).json({
        errCode: 4,
        message: 'Please payment before'
    }) 
    }
}

export const handleCheckBooking = async (tourId, 
                                        userId, 
                                        paymentId, 
                                        totalPrice, req, res) =>{
  try {
    const auth = await getToken();
    let paymentInfo = await verifyPayment(paymentId,auth.data.access_token);
    if(paymentInfo)
    {
      if(paymentInfo.status == "COMPLETED")
      {
        console.log(paymentInfo.status)
        let paymentSource = paymentInfo.payment_source;
        let payer = paymentInfo.payer; 
        let update_time = paymentInfo.update_time;
        let status = 1;
        let userData = await handleAddNewPayment(
                                                tourId, 
                                                userId, 
                                                paymentId, 
                                                paymentSource, 
                                                payer,
                                                totalPrice,
                                                status = 1,
                                                update_time)
        return true;
      }
      else{
        return false;
      }
    } else{
      return false;
    }
  }catch(e)
  {
    return false;
  }

}

export const handlePayment  = async (req, res) =>{
    let tourId = req.body.tourId;
    let userId = req.body.userId;
    let paymentId = req.body.paymentId;
    let arrayChild = req.body.arrayChild;
    let arrayAdult = req.body.arrayAdult;
    if(arrayChild)
    {
        arrayChild = JSON.parse(arrayChild);
    }
    if(arrayAdult)
    {
        arrayAdult = JSON.parse(arrayAdult);
    }
    let nTicketAdult = arrayAdult ? arrayAdult.length : 0;
    let nTicketChild = arrayChild ? arrayChild.length : 0;
    // let userData = await handleAddNewBooking(tourId, 
    //     userId,  
    //     paymentId);

    // return res.status(userData.status).json({
    //     errCode: userData.errCode, 
    //     message: userData.errMessage,
    //     userData
    // }) 
}

const getToken = async()=>{
  const CLIENT_ID = process.env.CLIENT_ID;
  const SECRET = process.env.CLIENT_SECRET;
  const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');
  const data = 'grant_type=client_credentials';
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
  };

  try {
    const response = await axios.post(`https://api-m.sandbox.paypal.com/v1/oauth2/token`, data, config);
    let dataReturn = {
      status : response.status,
      statusText: response.statusText,
      data : response.data
   }
    return dataReturn;
  } catch (error) {
    throw error;
  }
}
const verifyPayment = async(paymentId, accessToken) =>{
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.get(`https://api.sandbox.paypal.com/v2/checkout/orders/${paymentId}`, config);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }catch(e)
  {
    console.log('err')
  }
} 