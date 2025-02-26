import Register from '../models/register.schema';
import SendOtp from '../models/otpSend.schema';
import { Request, Response } from 'express';
import  bcrypt  from 'bcrypt';
import  jwt  from 'jsonwebtoken';
import { sendOTP } from '../services/otp.service';  // Import OTP service
import rateLimit from 'express-rate-limit';
import { validate } from 'class-validator';
import { RegisterInput } from '../dto/register.dto'
import { plainToClass } from 'class-transformer';

// Basic Register
// export const UserRegistration:any = async(req:Request,res:Response)=>{
// try {
//     console.log('in')
//     const createUser=await Register.create({...req.body})
//     console.log(createUser)
//     return res.status(200).json({message:'Register User',newUser:createUser})
// } catch (error) {
//     return res.status(500).json({message:'Error creating user',error:error})
// }
// }

//Basic Login

// export const UserLogin:any =  async(req:Request,res:Response)=>{
//     try {
//         const {email,password} = req.body
//         const loginUser = await Register.find({email,password});
//         return res.status(200).json({message:'Login Success',loginUser:loginUser})
//     } catch (error) {
//         return res.status(500).json({message:'Incorrect',error:error})            
//     }
// }

export const sendOtp:any = async(req:Request,res:Response)=>{
    try {
        const {email,userOtp} = req.body;
        // Send OTP email
        const otp = await sendOTP(email);  // Generate and send OTP
        const salt = await bcrypt.genSalt();
        const generateOTP = await bcrypt.hash(otp, salt);
        const sendOtp=await SendOtp.create({email,userOtp: generateOTP});
        // const token = jwt.sign({ _id: createUser._id, email: createUser.email},'secretkey',{ expiresIn: '1d' });
        return res.status(200).json({message:'OTP sent to email successfully.', otp })
    } catch (error) {
        return res.status(500).json({message:'Error sending otp',error:error})
    }
}

export const UserRegistration:any = async(req:Request,res:Response)=>{
try {
    const {name, email,password,otpCode} = req.body;
    const RegisterInputs = plainToClass(RegisterInput, req.body);
    const validationErrors = await validate(RegisterInputs, {
        validationError: { target: false }, // Do not include the validated object in the error output
        skipMissingProperties: false // Ensure all validation rules are checked
    });
    
    if (validationErrors.length > 0) {
        // Map validation errors to a cleaner format
        const errors = validationErrors.map(err => {
            return {
                property: err.property,
                constraints: err.constraints // Detailed error messages
            };
        });
        return res.status(400).json({ errors });
    }

    // Check if the email is already registered
    const userExists:any = await SendOtp.findOne({ email });
    if (!userExists) {
        return res.status(400).json({ message: 'Email is already registered' });
    }
    const userRegisterEmail:any = await Register.findOne({ email });
    if (userRegisterEmail) {
        return res.status(400).json({ message: 'Email is already registered' });
    }
    console.log(req.body.otpCode, userExists.userOtp)
    const validateOTP = await bcrypt.compare(req.body.otpCode, userExists.userOtp);
    console.log(validateOTP)
    if(!validateOTP){
        return res.status(400).json({ message: 'Enter Correct OTP!' });
    }
    const salt = await bcrypt.genSalt();
    const generatePassword = await bcrypt.hash(password, salt);
    const generateOTP = await bcrypt.hash(req.body.otpCode, salt);
    const createUser=await Register.create({name, email, password: generatePassword, otpCode: generateOTP});
    // const token = jwt.sign({ _id: createUser._id, email: createUser.email},'secretkey',{ expiresIn: '1d' });
    return res.status(200).json({message:'User registered successfully.'})
} catch (error) {
    return res.status(500).json({message:'Error creating user',error:error})
}
}

// const otpLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,  // 15 minutes
//     max: 5,  // Limit each email to 5 requests
//     message: 'Too many OTP requests, please try again later.',
//     keyGenerator: (req) => req.body.email,  // Use email as the key
//     handler: (req, res) => {
//       return res.status(429).json({
//         message: 'Too many OTP requests, please try again later.',
//       });
//     },
// });

export const UserLogin:any =  async(req:Request,res:Response)=>{
    try {
        // step1
        const validateEmail = await Register.findOne({email:req.body.email})
        if(!validateEmail){
            return res.status(400).json({message:'Email not found'})   
        }
        else {
            const validatePass = await bcrypt.compare(req.body.password, validateEmail.password);
            if(!validatePass) {
                return res.status(400).json({message:'Password Incorrect'}) 
            }
            else {
                const token = jwt.sign({ _id: validateEmail._id, email: validateEmail.email},'secretkey',{ expiresIn: '1d' });
                validateEmail.token = token;
                await validateEmail.save();

                return res.status(200).json({message:'User Login Success',token})  
                // const signature:any = req.get('Authorization');
                // if(!signature) {
                //     return res.status(400).json({message:'Authorization Required'})
                // }
                // else {
                //      const payload = jwt.verify(signature.split(' ')[1], 'secretkey'); 
                // return res.status(200).json({message:'User Login Success'})  
                // }
            }
        }
    } catch (error) {
        return res.status(500).json({message:'Error',error:error})            
    }
}


