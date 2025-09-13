// routes/orderRoutes.ts
import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import {authenticateJWT} from "../middlewares/authMiddleware"
const router = Router();

// Seller routes
router.get('/seller', authenticateJWT, OrderController.sellerOrders);
router.patch('/:id', authenticateJWT, OrderController.updateStatus);

// Buyer route
router.post('/', authenticateJWT, OrderController.createOrder);

export default router;
