// models/OrderModel.ts
import supabase from '../components/supabase';
import { IOrderStatusUpdateDTO } from '../types/order';
import {IOrderRow} from "../types/db";
import { CartModel } from './CartModel';
import {BookModel} from "./BookModel";

export class OrderModel {
    static table = 'orders';

    static async create(order: Partial<IOrderRow>): Promise<IOrderRow> {
        const { data, error } = await supabase
            .from(this.table)
            .insert([order])
            .select('*')
            .single();

        if (error) throw error;
        return data as IOrderRow;
    }

    static async findBySeller(seller_id: number): Promise<IOrderRow[]> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('seller_id', seller_id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data ?? []) as IOrderRow[];
    }

    static async findById(id: number): Promise<IOrderRow | null> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('id', id)
            .limit(1);

        if (error) throw error;
        return data && data.length > 0 ? (data[0] as IOrderRow) : null;
    }

    static async updateStatus(id: number, status: IOrderStatusUpdateDTO['status']): Promise<IOrderRow> {
        const { data, error } = await supabase
            .from(this.table)
            .update({ status, updated_at: new Date() })
            .eq('id', id)
            .select('*')
            .single();

        if (error) throw error;
        return data as IOrderRow;
    }

    static async createOrdersFromCart(buyer_id: number): Promise<IOrderRow[]> {
        // Fetch cart items
        const cartItems = await CartModel.findByBuyer(buyer_id);
        if (!cartItems.length) throw new Error('Cart is empty');
        const createdOrders: IOrderRow[] = [];
        for (const item of cartItems) {
            const itemSellerIdResult = await BookModel.findById(item.book_id)
            if(!itemSellerIdResult?.seller_id){
                throw new Error(`Seller not found for book ${item.book_id}`)
            }
            // For each cart item, create an order row
            const order = await this.create({
                buyer_id:buyer_id,
                seller_id: itemSellerIdResult?.seller_id,
                book_id: item.book_id,
                quantity: item.quantity,
                total_price: item.book_price * item.quantity,
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
            createdOrders.push(order);
        }
        // Clear the cart
        await CartModel.clearCart(buyer_id);
        return createdOrders;
    }
}
