import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  buyerUid: { type: String, required: true },
  buyerName: { type: String, required: true },
  email: { type: String },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  address: { type: String },
  phone: { type: String },
  date: { type: Date, default: Date.now },
  additionalNotes: { type: String },
  status: { type: String, default: "pending" } // "pending", "completed", "cancelled"
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
