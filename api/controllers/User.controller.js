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
