// types/cart.ts
import {IBook} from "./book";

export interface ICartItem {
    id: number;
    buyer_id: number;
    book_id: number;
    quantity: number;
    created_at?: string;
    book?: IBook; // optional: include book details for response
}

export interface ICartAddDTO {
    book_id: number;
    quantity: number;
}

export interface ICartUpdateDTO {
    quantity: number;
}
