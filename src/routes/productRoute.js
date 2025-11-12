// src/routes/productRoutes.js
import express from "express";
import {
  addProductOrPet,

} from "../controllers/productController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();


router.post("/", verifyToken, addProductOrPet);

export default router;
