import express from "express";
import { createUser,loginUser, logout,getMyProfile,changeMyRole, updateMyProfile} from "../controllers/userController.js";
import {  verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();


router.post("/",verifyFirebaseToken,createUser);
router.post("/login/",verifyFirebaseToken,loginUser);
router.post("/logout", logout);
router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);
router.put("/me/role", verifyToken, changeMyRole);

export default router;
