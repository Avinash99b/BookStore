// models/CartModel.ts
import supabase from '../components/supabase';
import { ICartAddDTO } from '../types/cart';
import { ICartRow } from '../types/db';

export class CartModel {
    static table = 'cart';

    static async add(buyer_id: number, item: ICartAddDTO): Promise<ICartRow> {
        const { data, error } = await supabase
            .from(this.table)
            .upsert([{ buyer_id, ...item }], { onConflict: 'buyer_id,book_id' })
            .select('*')
            .single();

        if (error) throw error;
        return data as ICartRow;
    }

    static async findByBuyer(buyer_id: number): Promise<{id: number, book_id: number, book_price: number, quantity: number, book_title: string}[]> {
        const { data, error } = await supabase
            .from(this.table)
            .select('id, book_id, quantity, books:book_id (price, title)')
            .eq('buyer_id', buyer_id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        // Map to required format
        return (data ?? []).map((item: any) => ({
            id: item.id,
            book_id: item.book_id,
            book_price: item.books?.price ?? 0,
            quantity: item.quantity,
            book_title: item.books?.title ?? '',
        }));
    }

    static async updateQuantity(id: number, quantity: number): Promise<ICartRow> {
        const { data, error } = await supabase
            .from(this.table)
            .update({ quantity })
            .eq('id', id)
            .select('*')
            .single();

        if (error) throw error;
        return data as ICartRow;
    }

    static async remove(id: number): Promise<void> {
        const { error } = await supabase
            .from(this.table)
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    static async clearCart(buyer_id: number): Promise<void> {
        const { error } = await supabase
            .from(this.table)
            .delete()
            .eq('buyer_id', buyer_id);

        if (error) throw error;
    }
}
