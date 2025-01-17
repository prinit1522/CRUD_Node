import { UserLogin, UserRegistration, sendOtp } from '../controllers/register.controller';
import { userProfile } from '../controllers/userProfile.controller';
import express from "express";
import { ValidateSignature } from '../middlewares/authentication';

const router = express.Router();

router.post('/',UserRegistration);
router.post('/login',UserLogin);
router.post('/user-profile', ValidateSignature, userProfile);
router.post('/sendOTP', sendOtp);


export { router as RegisterRouter };