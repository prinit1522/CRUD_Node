import DumpData from '../models/deletedDump.schema';
import SendOtp from '../models/otpSend.schema';
import Register from '../models/register.schema';
import UserProfile from '../models/userProfile.schema'
import { NextFunction, Request, Response } from 'express';
import UsersProfile from '../models/withCookiesRefreshToken/userProfileToken.schema';
import { generateToken, generateRefreshToken } from '../middlewares/cookies.authentication';

export const userProfile:any = async(req:Request,res:Response)=>{
    try {
        const user = (req as any).user;
        console.log('Authenticated User:', user);
        const createUserProfile=await UserProfile.create({...req.body});
        return res.status(200).json({message:'Profile Updated Success', createUserProfile});
    } catch (error) {
        return res.status(500).json({message:'Error Updating Profile',error:error});
    }
    }
//edit a user
export const editProfile:any = async(req:Request,res:Response)=>{
try {
    const user = (req as any).user;
    console.log('Authenticated User:', user);
    const { userId } = req.params
    const updatedUserProfile=await UserProfile.findOneAndUpdate(
        { userId: user._id }, 
        {...req.body },
        { new: true, upsert: true}
    );
    if (!updatedUserProfile) {
        return res.status(404).json({ message: 'User profile not found' });
    }
    return res.status(200).json({message:'Profile Updated Success', updatedUserProfile});
} catch (error:any) {
    return res.status(500).json({message:'Error Updating Profile',error:error.message});
}
}

//delete a user
// export const deleteUser:any = async(req:Request,res:Response)=>{
//     try {
//         const { userId } = req.params
//         const toDeleteUser = await UserProfile.findByIdAndDelete(
//             userId
//         )
//         if(!toDeleteUser) {
//             return res.status(404).json({ message: 'Profile data not found!'});
//         }
//         return res.status(200).json({ message: 'Profile deleted successfully', toDeleteUser });
//     } catch (error) {
//         return res.status(500).json({ message: 'Error deleting profile', error });
//     }
// }

export const deleteUserAccount:any = async(req:Request,res:Response)=>{
    try {
    const  userId  = req.params.userId;
      const decodedTokenData = (req as any).user;
      console.log(decodedTokenData.email,decodedTokenData);
      const deleteProfileData = await UserProfile.findOneAndDelete(
        {userId:decodedTokenData._id},
      )
    const deleteRegisterData = await Register.findOneAndDelete(
        {_id:decodedTokenData._id}
    )
    const deleteSendOtpData = await SendOtp.findOneAndDelete(
        {email:decodedTokenData.email}
    )  
    const storageDeletedData = await DumpData.create(
        {userId: decodedTokenData._id,email: decodedTokenData.email}
    ) 
    console.log(deleteProfileData,deleteRegisterData,deleteSendOtpData,storageDeletedData);
     return res.status(200).json({message:'Account Deleted Success'});

    } catch (error) {
        return res.status(500).json({ message: 'Error deleting user account', error });
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

//cookies authentication with refresh and expire token

export const createUser:any =async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const email = req.body.email;
        const findEmail = await UsersProfile.findOne({email});
        if(findEmail) {
           return res.status(400).json({message: 'Email Already Exists!'})
        }
        const userNew = await UsersProfile.create({...req.body});
        return res.status(200).json({message: 'User Created Successfully',userNew})
        
    } catch (error) {
        return res.status(500).json({message:'Error',error:error}) 
    }
}

export const userProfileLogin:any = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const {email, password} = req.body;
        const findEmail:any = await UsersProfile.findOne({email})
        if(findEmail && (await findEmail?.isPasswordMatched(password))){
            const refreshToken = await generateRefreshToken(findEmail?._id);
            const generateTokenOfUser = await generateToken(findEmail?._id);
            const updateUser = await UsersProfile.findByIdAndUpdate(
                findEmail?._id,
                { refreshToken },
                {new: true}
            )
            res.cookie('refreshToken',refreshToken,{
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,  
            })
            return res.status(200).json({message:'Login Successfully', updateUser, generateTokenOfUser})
        }
        return res.status(400).json({message: 'Email or password Invalid!'})
        
    } catch (error) {
        return res.status(500).json({message:'Error',error:error})  
    }
}


