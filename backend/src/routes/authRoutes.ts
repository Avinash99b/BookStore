// routes/authRoutes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// POST /api/auth/register
router.post('/register', AuthController.register);

// POST /api/auth/login
router.post('/login', AuthController.login);

export default router;
