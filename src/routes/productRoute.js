// src/routes/productRoutes.js
import express from "express";
import {
  addProductOrPet,
  getMyListings,
  getProductById,
  getProducts,
  updateProduct,deleteProduct

} from "../controllers/productController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();


router.post("/", verifyToken, addProductOrPet);
router.get("/my-listing", verifyToken, getMyListings);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", verifyToken, deleteProduct);

// Update a product
router.put("/:id", verifyToken, updateProduct);

export default router;
