import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoute.js";
import orderRoutes from "./routes/orderRoute.js";

import Product from "./models/Product.js";
import { verifyToken } from "./middlewares/verifyToken.js";

dotenv.config()


const app = express()


connectDB()


app.use(express.json())

app.use(cookieParser())

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

app.use(morgan("dev"))

app.use(helmet())



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  message: { error: "Too many requests, slow down" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);




app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", verifyToken, orderRoutes);




app.get("/", async (req, res) => {


  res.status(200).json({
    message: "Welcome to PawMart API",
    status: 200
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
