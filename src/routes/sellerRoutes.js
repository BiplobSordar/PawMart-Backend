import express from 'express';
import {
  getDashboardStats,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getCustomers,
  getAnalytics,

} from '../controllers/sellerController.js';


const router = express.Router();




router.get('/dashboard', getDashboardStats);


router.route('/products')
  .get(getProducts)
  .post(createProduct);

  router.put('/orders/:id/status', updateOrderStatus);
router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);


router.get('/orders', getOrders);


router.get('/customers', getCustomers);


router.get('/analytics', getAnalytics);




export default router;