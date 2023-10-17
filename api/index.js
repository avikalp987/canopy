import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routes/User.route.js";
dotenv.config();

const app = express();

mongoose
.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})

app.use("/api/user",UserRouter);