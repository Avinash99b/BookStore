// controllers/CartController.ts
import { Request, Response } from 'express';
import { CartModel } from '../models/CartModel';
import { ICartAddDTO, ICartUpdateDTO } from '../types/cart';

export class CartController {
    static async addToCart(req: Request, res: Response) {
        try {
            const buyer_id = req.user!.id;
            const data: ICartAddDTO = req.body;
            const item = await CartModel.add(buyer_id, data);
            return res.status(201).json({ item });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    static async getCart(req: Request, res: Response) {
        try {
            const buyer_id = req.user!.id;
            const items = await CartModel.findByBuyer(buyer_id);
            return res.json({ items });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    static async updateCartItem(req: Request, res: Response) {
        try {
            const itemId = Number(req.params.id);
            const data: ICartUpdateDTO = req.body;
            const updated = await CartModel.updateQuantity(itemId, data.quantity);
            return res.json({ item: updated });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    static async removeCartItem(req: Request, res: Response) {
        try {
            const itemId = Number(req.params.id);
            await CartModel.remove(itemId);
            return res.json({ success: true });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    static async clearCart(req: Request, res: Response) {
        try {
            const buyer_id = req.user!.id;
            await CartModel.clearCart(buyer_id);
            return res.json({ success: true });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }
}
