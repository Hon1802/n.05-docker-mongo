import { handleUserRegister } from "../src/services/userService.js";
import * as data from "./user.json" assert { type: "json" };

export const uploadUser = async() => { 
    for (var i = 0; i < data.default.length; i++)
    {
        try {

            await uploadEach(data.default[i]);
        }catch(e)
        {
            console.log('cant upload')
        }
       
    }
}

async function uploadEach(item) {
    return await handleUserRegister(
        item.name, 
        item.address, 
        item.email,
        item.password,
        item.phoneNumber,
        item.gender)
}