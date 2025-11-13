import User from '../models/User.js'
import jwt from 'jsonwebtoken'

export const createUser = async (req, res) => {
  try {
    const { uid, email } = req.firebaseUser;
    const { name, avatar } = req.body



    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ message: "User with this UID already exists" });
    }


    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }


    await User.create({
      uid,
      email,
      name: name || "Unnamed User",
      role: "user",
      avatar

    });



    res.status(201).json({
      message: "New user created successfully",


    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { uid, email, name } = req.firebaseUser;

    if (!uid || !email) {
      return res.status(400).json({ message: "Invalid Firebase user data" });
    }


    let user = await User.findOne({ uid });


    if (!user) {
      user = await User.findOne({ email });
    }


    if (!user) {
      user = await User.create({
        uid,
        email,
        name: name || "Unnamed User",
        role: "user",

      });
    }

    const payload = {
      uid: user.uid,
      id: user?._id,
      email: user.email,
      permissions: user.permissions || [],
      role: user.role || "user"
    };


    const jwtToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.status(200).json({
      message: "Login successful",
      user,
      token: jwtToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const logout = (req, res) => {
  try {

    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};