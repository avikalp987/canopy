import express from "express";
import { deleteUser, getUser, getUserListing, test, updateUser } from "../controllers/User.controller.js";
import { verifyToken } from "../utils/VerifyUser.js";

const router = express.Router();
router.get("/test",test);
router.post("/update/:id",verifyToken,updateUser);
router.delete("/delete/:id",verifyToken,deleteUser);
router.get("/listings/:id",verifyToken,getUserListing);
router.get("/:id",verifyToken,getUser)

export default router;
