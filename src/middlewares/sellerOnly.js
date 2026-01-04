export const sellerOnly = (req, res, next) => {
  
  if (req.user.role !== 'seller') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Seller privileges required.'
    });
  }
  next();
};