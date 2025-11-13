
import express from "express";
import { createOrder, getOrdersForMe } from "../controllers/orderController.js";




const router = express.Router();


router.post("/", createOrder);
router.get("/for-me", getOrdersForMe);


export default router;
