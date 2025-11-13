import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";


export const createOrder = async (req, res) => {
  try {
    const { uid } = req.user;

    if (!uid) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const {
      productId,
      quantity,
      price,
      address,
      date,
      phone,
      notes,
      isPet,
    } = req.body;

    if (!productId || !address || !date || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

   
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

   
    const finalQuantity = isPet ? 1 : quantity || 1;
    const finalPrice = isPet ? 0 : price || product.price || 0;

   
    const newOrder = await Order.create({
      productId,
      buyerId: user._id, 
      quantity: finalQuantity,
      price: finalPrice,
      address,
      date,
      phone,
      notes,
      isPet: !!isPet,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
