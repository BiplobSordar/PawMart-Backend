
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
   
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

  
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }


    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "User is blocked",
      });
    }

    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
      address: user.address,
      phone: user.phone,
      avatar: user.avatar,
      uid:user.uid
    };

    

    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);

    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
