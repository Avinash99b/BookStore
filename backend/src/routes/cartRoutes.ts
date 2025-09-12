// routes/cartRoutes.ts
import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Buyer cart routes
router.post('/', authenticateJWT, CartController.addToCart);
router.get('/', authenticateJWT, CartController.getCart);
router.patch('/:id', authenticateJWT, CartController.updateCartItem);
router.delete('/:id', authenticateJWT, CartController.removeCartItem);
router.delete('/', authenticateJWT, CartController.clearCart);

export default router;
