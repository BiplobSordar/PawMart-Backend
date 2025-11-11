import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  sellerUid: { type: String, required: true }, // Firebase UID of seller
  date: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
