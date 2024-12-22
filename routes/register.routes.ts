import {UserRegistration} from '../controllers/regiser.controller'
import express from "express"
const router = express.Router();

router.post('/',UserRegistration)
export { router as RegisterRouter };