import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, default: function() { return this.isPet ? 0 : 1 }},
  description: { type: String },
  image: { type: String },
  sellerUid: { type: String, required: true },
  isPet: { type: Boolean, default: false },
  age: { type: Number },
  breed: { type: String },
  adoptionStatus: { type: String, enum: ["available", "adopted"], default: "available" },
  stock: { type: Number, default: function() { return this.isPet ? 1 : 0 } },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
