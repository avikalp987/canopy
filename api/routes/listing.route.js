import express from "express";
import { createListing, deleteListing } from "../controllers/Listing.controller.js";
import { verifyToken } from "../utils/VerifyUser.js";
const router = express.Router();

router.post("/create",verifyToken,createListing);
router.delete("/delete/:id",verifyToken,deleteListing);

export default router;