import express from "express"
import mongoose from "mongoose"
import cors from "cors";
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend origin
}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
import {RegisterRouter} from "./routes/register.routes";
app.use('/api/register',RegisterRouter)
const port = 8000;
async function start() {
    try{
  const connection = await mongoose.connect("mongodb://127.0.0.1:27017/crud");
  console.log("connection established",port);
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}catch(e){
    console.log(e);
}
}
start();
