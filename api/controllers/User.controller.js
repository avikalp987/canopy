import Listing from "../models/Listing.model.js";
import User from "../models/User.model.js";
import { ErrorHandler } from "../utils/Error.js"
import bcrpyt from "bcryptjs";

export const test = (req,res)=>{
    res.json({
        message:"Hello Vikalp api user controller",
    })
}

export const updateUser = async (req,res,next) => {
    if(req.user.id !== req.params.id)
    {
        return next(ErrorHandler(401,"Access denied"));
    }
    try {
        if(req.body.password)
        {
            req.body.password = bcrpyt.hashSync(req.body.password,10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username : req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar,
            }
        },{new:true})
        const {password,...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req,res,next)=>{
    if(req.user.id!==req.params.id)
    {
        return next(ErrorHandler(401,"Access Denied"));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("access_token");
        res.status(200).json("User deleated");
    } catch (error) {
        next(error);
    }
}

export const getUserListing = async(req,res,next)=>{
    if(req.user.id === req.params.id)
    {
        try {
            const listings = await Listing.find({userRef:req.params.id});
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }
    }
    else{
        return next(ErrorHandler(401,"You can only view your own listings"));
    }
}
