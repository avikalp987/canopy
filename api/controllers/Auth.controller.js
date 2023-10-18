import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { ErrorHandler } from "../utils/Error.js";
import jwt from "jsonwebtoken";

export const signup = async (req,res,next)=>{
    const {username,email,password} = req.body;
    const hashedPassword = bcrypt.hashSync(password,10);
    const newUser = new User({
        username,
        email,
        password:hashedPassword,
    });
    try {
        await newUser.save();
        res.status(201)
        .json("User created Successfully");
    } catch (error) {
        next(error);
    }
}

export const signin = async (req,res,next)=>{
    const {email,password} = req.body;
    try {
        const validUser =  await User.findOne({email});
        if(!validUser){
            return next(ErrorHandler(404,"User Not Found!"));
        }
        const validPassword = bcrypt.compareSync(password,validUser.password);
        if(!validPassword)
        {
            return next(ErrorHandler(401,"Wrong Credentials"));
        }
        const {password:pass,...rest} = validUser._doc;
        const token =  jwt.sign({id:validUser._id},process.env.JWTSECRET);
        res.cookie("access_token",token,{httpOnly:true,expires: new Date(Date.now()+24*60*60*1000)})
        .status(200).json(rest);

    } catch (error) {
        next(error);
    }
}