import { Request, Response } from 'express';
import { BookModel } from '../models/BookModel';
import { IBookCreateDTO, IBookUpdateDTO } from '../types/book';

export class BookController {
    // Add a new book (seller only)
    static async addBook(req: Request, res: Response) {
        try {
            const seller_id = req.user!.id;
            const data: IBookCreateDTO = req.body;
            if (!data.title || data.price == null) {
                return res.status(400).json({ error: 'title and price required' });
            }

            const book = await BookModel.create(seller_id, data);
            return res.status(201).json({ book });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // List books for a seller
    static async listSellerBooks(req: Request, res: Response) {
        try {
            const seller_id = req.user!.id;
            const books = await BookModel.findBySeller(seller_id);
            return res.json({ books });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Update a book
    static async updateBook(req: Request, res: Response) {
        try {
            const bookId = Number(req.params.id);
            const data: IBookUpdateDTO = req.body;

            const updatedBook = await BookModel.update(bookId, data);
            return res.json({ book: updatedBook });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Delete a book
    static async deleteBook(req: Request, res: Response) {
        try {
            const bookId = Number(req.params.id);
            await BookModel.delete(bookId);
            return res.json({ success: true, message: 'Book deleted' });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // List all books (public)
    static async listAllBooks(req: Request, res: Response) {
        try {
            const books = await BookModel.findAll();
            return res.json({ books });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Get a specific book by ID (public)
    static async getBookById(req: Request, res: Response) {
        try {
            const bookId = Number(req.params.id);
            if (isNaN(bookId)) {
                return res.status(400).json({ error: 'Invalid book ID' });
            }
            const book = await BookModel.findById(bookId);
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }
            return res.json({ book });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }
}
