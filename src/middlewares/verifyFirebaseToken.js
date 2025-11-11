import admin from "../config/firebase.js";

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided in Authorization header" });
    }

    const token = authHeader.split(" ")[1];


    const decoded = await admin.auth().verifyIdToken(token);

   
    req.firebaseUser = decoded;

    next(); 
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    res.status(401).json({ message: "Invalid or expired Firebase token" });
  }
};



