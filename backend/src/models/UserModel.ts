// models/UserModel.ts
import supabase from '../components/supabase';
import {IUserRegisterDTO } from '../types/user';
import {IUserRow} from "../types/db";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class UserModel {
    static table = 'users';

    // Create new user
    static async create(data: IUserRegisterDTO): Promise<IUserRow> {
        const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

        const { data: user, error } = await supabase
            .from(this.table)
            .insert([
                {
                    name: data.name,
                    email: data.email,
                    password_hash,
                    role: data.role || 'buyer'
                }
            ])
            .select('*')
            .single();

        if (error) throw error;
        return user as IUserRow;
    }

    // Find by email
    static async findByEmail(email: string): Promise<IUserRow | null> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('email', email)
            .limit(1);

        if (error) throw error;
        return data && data.length > 0 ? (data[0] as IUserRow) : null;
    }

    // Find by ID
    static async findById(id: number): Promise<IUserRow | null> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('id', id)
            .limit(1);

        if (error) throw error;
        return data && data.length > 0 ? (data[0] as IUserRow) : null;
    }
}
