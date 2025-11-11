import express from "express";
import { createUser,loginUser} from "../controllers/userController.js";
import {  verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";

const router = express.Router();


router.post("/",verifyFirebaseToken,createUser);
router.post("/login/",verifyFirebaseToken,loginUser);

export default router;
