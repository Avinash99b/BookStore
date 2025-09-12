// models/BookModel.ts
import supabase from '../components/supabase';
import {  IBookCreateDTO, IBookUpdateDTO } from '../types/book';
import {IBookRow} from "../types/db";

export class BookModel {
    static table = 'books';

    static async create(seller_id: number, data: IBookCreateDTO): Promise<IBookRow> {
        const { data: book, error } = await supabase
            .from(this.table)
            .insert([{ seller_id, ...data }])
            .select('*')
            .single();

        if (error) throw error;
        return book as IBookRow;
    }

    static async findBySeller(seller_id: number): Promise<IBookRow[]> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('seller_id', seller_id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data ?? []) as IBookRow[];
    }

    static async findById(id: number): Promise<IBookRow | null> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('id', id)
            .limit(1);

        if (error) throw error;
        return data && data.length > 0 ? (data[0] as IBookRow) : null;
    }

    static async update(id: number, data: IBookUpdateDTO): Promise<IBookRow> {
        const { data: updated, error } = await supabase
            .from(this.table)
            .update(data)
            .eq('id', id)
            .select('*')
            .single();

        if (error) throw error;
        return updated as IBookRow;
    }

    static async delete(id: number): Promise<void> {
        const { error } = await supabase
            .from(this.table)
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    static async findAll(): Promise<IBookRow[]> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data ?? []) as IBookRow[];
    }
}
