// controllers/OrderController.ts
import { Request, Response } from 'express';
import { OrderModel } from '../models/OrderModel';
import { IOrderStatusUpdateDTO } from '../types/order';

export class OrderController {
    // Seller: get all orders for seller
    static async sellerOrders(req: Request, res: Response) {
        try {
            const seller_id = req.user!.id;
            const orders = await OrderModel.findBySeller(seller_id);
            return res.json({ orders });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Seller: update order status
    static async updateStatus(req: Request, res: Response) {
        try {
            const orderId = Number(req.params.id);
            const { status }: IOrderStatusUpdateDTO = req.body;

            if (!status) return res.status(400).json({ error: 'status required' });

            const updatedOrder = await OrderModel.updateStatus(orderId, status);
            return res.json({ order: updatedOrder });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Buyer: create order from cart
    static async createOrder(req: Request, res: Response) {
        try {
            const buyer_id = req.user!.id;
            const orders = await OrderModel.createOrdersFromCart(buyer_id);
            return res.status(201).json({ orders });
        } catch (err: any) {
            console.error(err);
            return res.status(400).json({ error: err.message || 'Order creation failed' });
        }
    }
}
