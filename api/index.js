import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routes/User.route.js";
import AuthRouter from "./routes/auth.route.js"
import ListingRouter from "./routes/listing.route.js"
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

mongoose
.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});

const __dirname = path.resolve();

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})

app.use("/api/user",UserRouter);
app.use("/api/auth",AuthRouter);
app.use("/api/listing",ListingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});