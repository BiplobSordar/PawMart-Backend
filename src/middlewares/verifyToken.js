
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
 
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    


    req.user = decoded; 
    next();


  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
