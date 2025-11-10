import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

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



app.get("/", (req, res) => {
  res.json({ message: "Welcome to PawMart API" });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
