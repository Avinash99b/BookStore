// types/db.ts
export interface IUserRow {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: 'buyer' | 'seller';
    created_at: string;
}

export interface IBookRow {
    id: number;
    seller_id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
    image_url?: string;
    created_at: string;
}

export interface IOrderRow {
    id: number;
    buyer_id: number;
    seller_id: number;
    book_id: number;
    quantity: number;
    total_price: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface ICartRow {
    id: number;
    buyer_id: number;
    book_id: number;
    quantity: number;
    created_at: string;
}
