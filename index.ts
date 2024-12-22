import express from "express"
import mongoose from "mongoose"
const app = express();
import {RegisterRouter} from "./routes/register.routes";
const port = 8000;
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/register',RegisterRouter)
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
