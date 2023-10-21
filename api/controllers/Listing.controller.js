import Listing from "../models/Listing.model.js";

export const createListing = async (req,res,next)=>{
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};