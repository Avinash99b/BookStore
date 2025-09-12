// types/order.ts
import { IBook } from './book';
import { IUser } from './user';

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface IOrder {
  id: number;
  buyer_id: number;
  seller_id: number;
  book_id: number;
  quantity: number;
  total_price: number;
  status: OrderStatus;
  created_at?: string;
  updated_at?: string;
  book?: IBook;       // optional: book details
  buyer?: IUser;      // optional: buyer details
}

export interface IOrderCreateDTO {
  book_id: number;
  quantity: number;
}

export interface IOrderStatusUpdateDTO {
  status: OrderStatus;
}
