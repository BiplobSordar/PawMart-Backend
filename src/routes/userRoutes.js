import express from "express";
import { createUser,loginUser, logout} from "../controllers/userController.js";
import {  verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";

const router = express.Router();


router.post("/",verifyFirebaseToken,createUser);
router.post("/login/",verifyFirebaseToken,loginUser);
router.post("/logout", logout);

export default router;
