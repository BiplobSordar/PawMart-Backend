import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String },
  age: { type: String },
  description: { type: String },
  image: { type: String },
  location: { type: String },
  ownerUid: { type: String, required: true }, 
  date: { type: Date, default: Date.now },
  status: { type: String, default: "available" } // "available", "adopted"
});

const Pet = mongoose.model("Pet", petSchema);
export default Pet;
