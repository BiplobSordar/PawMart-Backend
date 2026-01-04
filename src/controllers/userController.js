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
      sameSite: "None",
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
      sameSite: "None",
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




export const getMyProfile = async (req, res) => {
  try {
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const userId = req.user.id;


    const user = await User.findById(userId).select("-password");

  
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

  
    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error("GetMyProfile Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};






export const updateMyProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const userId = req.user.id;

 
    const allowedFields = ["name", "email", "address", "phone", "avatar"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided",
      });
    }


    if (req.body.role) {
      return res.status(403).json({
        success: false,
        message: "You cannot change role",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};






export const changeMyRole = async (req, res) => {
  try {
 
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const userId = req.user.id;
    const { role } = req.body;


    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

  
    const allowedRoles = ["user", "seller"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role value",
      });
    }

 
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

   
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.error("ChangeMyRole Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to change role",
    });
  }
};

