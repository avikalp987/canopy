import express from "express";
import { createListing, deleteListing, getListing, updateListing } from "../controllers/Listing.controller.js";
import { verifyToken } from "../utils/VerifyUser.js";
const router = express.Router();

router.post("/create",verifyToken,createListing);
router.delete("/delete/:id",verifyToken,deleteListing);
router.post("/update/:id",verifyToken,updateListing);
router.get("/get/:id",getListing);

export default router;