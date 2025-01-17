import UserProfile from '../models/userProfile.schema'
import { Request, Response } from 'express';

export const userProfile:any = async(req:Request,res:Response)=>{
try {
    const user = (req as any).user;
    console.log('Authenticated User:', user);
    const createUserProfile=await UserProfile.create({...req.body});
    return res.status(200).json({message:'Profile Updated Success'});
} catch (error) {
    return res.status(500).json({message:'Error Updating Profile',error:error});
}
}

// export const UserLogin:any =  async(req:Request,res:Response)=>{
//     try {
//         // step1
//         const validateEmail = await Register.findOne({email:req.body.email})
//         if(!validateEmail){
//             return res.status(400).json({message:'Email not found'})   
//         }
//         else {
//             const validatePass = await bcrypt.compare(req.body.password, validateEmail.password);
//             if(!validatePass) {
//                 return res.status(400).json({message:'Password Incorrect'}) 
//             }
//             else {
//                 const token = jwt.sign({ _id: validateEmail._id, email: validateEmail.email},'secretkey',{ expiresIn: '1d' });
//                 return res.status(200).json({message:'User Login Success',token})  
//                 // const signature:any = req.get('Authorization');
//                 // if(!signature) {
//                 //     return res.status(400).json({message:'Authorization Required'})
//                 // }
//                 // else {
//                 //      const payload = jwt.verify(signature.split(' ')[1], 'secretkey'); 
//                 // return res.status(200).json({message:'User Login Success'})  
//                 // }
//             }
//         }
//     } catch (error) {
//         return res.status(500).json({message:'Error',error:error})            
//     }
// }


