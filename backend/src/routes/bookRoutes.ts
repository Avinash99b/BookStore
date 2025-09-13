// routes/bookRoutes.ts
import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Public route to fetch all books
router.get('/', BookController.listAllBooks);


// Protected routes (seller only)
router.post('/', authenticateJWT, BookController.addBook);
router.get('/my', authenticateJWT, BookController.listSellerBooks);
// Public route to fetch a specific book by ID
router.get('/:id', BookController.getBookById);
router.patch('/:id', authenticateJWT, BookController.updateBook);
router.delete('/:id', authenticateJWT, BookController.deleteBook);

export default router;
