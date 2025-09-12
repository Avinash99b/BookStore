// models/OrderModel.ts
import supabase from '../components/supabase';
import { IOrderStatusUpdateDTO } from '../types/order';
import {IOrderRow} from "../types/db";

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
}
