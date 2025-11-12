// src/middleware/verifyToken.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // ✅ Extract token from cookies
    const token = req.cookies?.token;
    console.log(token,'this is the token')

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    // ✅ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
