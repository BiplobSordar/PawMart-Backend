import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  phone: { type: String },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  permissions: {
    type: [String], // ["adopter", "breeder", "seller"]
    default: ["adopter"]
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
