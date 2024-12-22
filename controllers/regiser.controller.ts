import Register from '../models/register.schema'
import { Request, Response, NextFunction } from 'express'

export const UserRegistration:any= async(req:Request,res:Response)=>{
try {
    console.log('in')
    const createUser=await Register.create({...req.body})
    console.log(createUser)
    return res.status(200).json({message:'Register User',newUser:createUser})
} catch (error) {
    return res.status(500).json({message:'Error creating user',error:error})
}
}


