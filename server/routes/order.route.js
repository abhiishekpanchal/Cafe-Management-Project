import express from 'express';
import { deleteOrder, getOrders, placeOrder } from '../controllers/order.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/placeOrder/:cafeId/:tableId', placeOrder);
router.get('/getOrders/:cafeId',authenticateJWT, getOrders);
router.delete('/deleteOrder', authenticateJWT, deleteOrder);

export default router;