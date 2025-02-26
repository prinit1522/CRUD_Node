import mongoose from "mongoose";
const  registerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    otpCode:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    }
})

const Register= mongoose.model('Register',registerSchema)
export default Register