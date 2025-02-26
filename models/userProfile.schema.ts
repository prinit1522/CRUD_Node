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
    },
     // Reference to the _id of the register collection (User's ID)
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',  // Assuming 'Register' is your register collection's model
        required: true
    }
})

const UserProfile= mongoose.model('UserProfile',userProfileSchema)
export default UserProfile