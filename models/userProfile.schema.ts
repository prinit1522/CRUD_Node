import mongoose from "mongoose";
const  userProfileSchema=new mongoose.Schema({
    gender:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true
    },
    dateofbirth:{
        type:Date,
        required:true
    }
})

const UserProfile= mongoose.model('UserProfile',userProfileSchema)
export default UserProfile