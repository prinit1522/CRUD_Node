import mongoose from "mongoose";

const  otpSendSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    userOtp:{
        type:String,
        unique:true
    },
})

const SendOtp = mongoose.model('SendOtp',otpSendSchema)
export default SendOtp