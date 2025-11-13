import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    buyerId: {         // or userId
       type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: function () {
        return this.isPet ? 1 : 1;
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: function () {
        return this.isPet ? 0 : 0;
      },
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    isPet: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
