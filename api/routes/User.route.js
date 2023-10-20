import express from "express";
import { test, updateUser } from "../controllers/User.controller.js";
import { verifyToken } from "../utils/VerifyUser.js";

const router = express.Router();
router.get("/test",test);
router.post("/update/:id",verifyToken,updateUser);

export default router;
