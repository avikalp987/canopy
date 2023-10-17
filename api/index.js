import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routes/User.route.js";
import AuthRouter from "./routes/auth.route.js"
dotenv.config();

const app = express();
app.use(express.json());

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
app.use("/api/auth",AuthRouter);

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});