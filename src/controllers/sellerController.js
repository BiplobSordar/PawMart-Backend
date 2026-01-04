import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const getDashboardStats = async (req, res) => {
  try {
    console.log(req.user)
    const sellerId = req.user.id;
    
    
    const totalProducts = await Product.countDocuments({ sellerUid: req.user.uid });
      console.log(totalProducts,'this is totoalProjeuct')
    const totalOrders = await Order.countDocuments({ sellerId });
    
    const pendingOrders = await Order.countDocuments({ 
      sellerId, 
      status: 'pending' 
    });
    
    const completedOrders = await Order.countDocuments({ 
      sellerId, 
      status: 'completed' 
    });
    
    const totalRevenue = await Order.aggregate([
      { 
        $match: { 
          sellerId: new mongoose.Types.ObjectId(sellerId),
          status: 'completed'
        } 
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      }
    ]);
    
    const recentOrders = await Order.find({ sellerId })
      .populate('buyerId', 'name email')
      .populate('productId', 'name')
      .sort('-createdAt')
      .limit(5);
    
    const lowStockProducts = await Product.find({
      sellerUid: req.user.uid,
      stock: { $lt: 10 },
      isPet: false
    }).limit(5);
    
    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders,
        lowStockProducts
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};


export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category, status } = req.query;
    const skip = (page - 1) * limit;
    
    const query = { sellerUid: req.user.uid };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      if (status === 'available') {
        query.$or = [
          { adoptionStatus: 'available' },
          { stock: { $gt: 0 } }
        ];
      } else if (status === 'outOfStock') {
        query.$or = [
          { adoptionStatus: 'adopted' },
          { stock: 0 }
        ];
      }
    }
    
    const products = await Product.find(query)
      .populate('category', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt');
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};


export const createProduct = async (req, res) => {
  try {
    const { isPet } = req.body;
    
    if (isPet && req.user.permissions.includes('breeder')) {
      return res.status(403).json({
        success: false,
        message: 'You need breeder permissions to list pets'
      });
    }
    
    const productData = {
      ...req.body,
      sellerUid: req.user.uid
    };
    
    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerUid: req.user.uid
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerUid: req.user.uid
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    

    const pendingOrders = await Order.countDocuments({
      productId: req.params.id,
      status: 'pending'
    });
    
    if (pendingOrders > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete product with pending orders'
      });
    }
    
    await product.deleteOne();
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};


export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;
    
    const query = { sellerId: req.user.id };
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(query)
      .populate('buyerId', 'name email phone')
      .populate('productId', 'name price image')
      .populate('sellerId', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt');
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const order = await Order.findOne({
      _id: req.params.id,
      sellerId: req.user.id
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
  
    if (status === 'completed' && order.isPet) {
      await Product.findByIdAndUpdate(order.productId, {
        adoptionStatus: 'adopted'
      });
    }
    
    order.status = status;
    await order.save();
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};


export const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const customers = await Order.aggregate([
      { $match: { sellerId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: '$buyerId',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: { $multiply: ['$price', '$quantity'] } },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customerInfo'
        }
      },
      { $unwind: '$customerInfo' },
      {
        $project: {
          _id: 1,
          name: '$customerInfo.name',
          email: '$customerInfo.email',
          phone: '$customerInfo.phone',
          totalOrders: 1,
          totalSpent: 1,
          firstOrder: 1,
          lastOrder: 1
        }
      },
      { $skip: skip },
      { $limit: parseInt(limit) },
      { $sort: { totalSpent: -1 } }
    ]);
    
    const total = await Order.distinct('buyerId', { 
      sellerId: req.user._id 
    }).countDocuments();
    
    res.json({
      success: true,
      data: customers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};


export const getAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const sellerId = req.user.id;
    
  
    let groupByFormat;
    let startDate;
    
    switch (period) {
      case 'day':
        groupByFormat = { hour: { $hour: '$createdAt' } };
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        groupByFormat = { day: { $dayOfMonth: '$createdAt' } };
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
      default:
        groupByFormat = { day: { $dayOfMonth: '$createdAt' } };
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
    }
    
    const salesOverTime = await Order.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupByFormat,
          totalSales: { $sum: { $multiply: ['$price', '$quantity'] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
 
    const topProducts = await Order.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$productId',
          totalSold: { $sum: '$quantity' },
          totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);
    
  
    const orderStats = await Order.aggregate([
      { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        salesOverTime,
        topProducts,
        orderStats,
        period
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};



function convertToCSV(data, type) {
  if (!data.length) return '';
  
  const headers = type === 'sales' 
    ? ['Order ID', 'Date', 'Customer', 'Product', 'Quantity', 'Price', 'Total', 'Status']
    : ['Product ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Last Updated'];
  
  const rows = data.map(item => {
    if (type === 'sales') {
      return [
        item._id,
        item.createdAt.toISOString().split('T')[0],
        item.buyerId?.name || 'N/A',
        item.productId?.name || 'N/A',
        item.quantity,
        item.price,
        item.price * item.quantity,
        item.status
      ].join(',');
    } else {
      return [
        item._id,
        item.name,
        item.category?.name || 'N/A',
        item.price,
        item.stock || 0,
        item.adoptionStatus || 'available',
        item.updatedAt.toISOString().split('T')[0]
      ].join(',');
    }
  });
  
  return [headers.join(','), ...rows].join('\n');
}