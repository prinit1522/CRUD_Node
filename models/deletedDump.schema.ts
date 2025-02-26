import mongoose from "mongoose";
const  dumpDeleteSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
})

const DumpData= mongoose.model('DumpData',dumpDeleteSchema)
export default DumpData