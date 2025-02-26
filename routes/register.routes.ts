import { UserLogin, UserRegistration, sendOtp } from '../controllers/register.controller';
import { userProfile, editProfile, deleteUserAccount, createUser, userProfileLogin } from '../controllers/userProfile.controller';
import express from "express";
import { ValidateSignature } from '../middlewares/authentication';

const router = express.Router();

router.post('/',UserRegistration);
router.post('/login',UserLogin);
router.post('/user-profile', ValidateSignature, userProfile);
router.put('/user-profile/:userId', ValidateSignature, editProfile);
router.post('/sendOTP', sendOtp);
router.delete('/user-profile/:userId', ValidateSignature, deleteUserAccount);
router.post('/user-Create', createUser);
router.post('/user-login', userProfileLogin);


export { router as RegisterRouter };