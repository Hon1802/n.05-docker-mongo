import mongoose from "mongoose";
let connect = async(MONGO_URI)=>{
    try{
        console.log(MONGO_URI);
        console.log("asdas")
        const connection = await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('connect successfully')
    } catch(error){
        const {code} = error
        if(error.code == 8000){
            throw new Error("Wrong database'username or password")
        }else if(code =="ENOTFOUND"){
            throw new Error("Wrong connect name/connection string")
        }
        console.log(MONGO_URI); 
        throw new Error("Cannot connect to Mongoose")
    }
}
export default connect;