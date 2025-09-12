// types/book.ts
export interface IBook {
    id: number;
    seller_id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
    image_url?: string;
    created_at?: string;
}

export interface IBookCreateDTO {
    title: string;
    description?: string;
    price: number;
    stock?: number;
    image_url?: string;
}

export interface IBookUpdateDTO {
    title?: string;
    description?: string;
    price?: number;
    stock?: number;
    image_url?: string;
}
