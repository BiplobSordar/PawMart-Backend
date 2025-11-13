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
    const seller = await User.findOne({ uid: product.sellerUid });


    if(!seller){
      return res.status(404).json({ message: "User not found" });
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
      sellerId:seller._id
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








export const getOrdersForMe = async (req, res) => {
  try {
    const sellerId = req.user.id; 

   
    const orders = await Order.find({ sellerId })
      .populate({
        path: "productId",
        select: "name isPet image", 
      })
      .populate({
        path: "buyerId",
        select: "name phone",
      })
      .sort({ createdAt: -1 });
      console.log(orders)

   
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      listing: {
        _id: order.productId._id,
        name: order.productId.name,
        isPet: order.productId.isPet,
        image: order.productId.image, 
      },
      buyerName: order.buyerId.name,
      price: order.price,
      quantity: order.quantity,
      address: order.address,
      phone: order.phone,
      date: order.date,
      notes: order.notes || "",
      status: order.status,
      createdAt: order.createdAt,
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error("getOrdersForMe error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
