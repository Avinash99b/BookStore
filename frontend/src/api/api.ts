// Centralized API functions for backend integration
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://advanced-shepherd-pleasantly.ngrok-free.app/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const register = (name: string, email: string, password: string, role: string) =>
  api.post('/auth/register', { name, email, password, role });

export const getBooks = () => api.get('/books');
export const getBookById = (id: number) => api.get(`/books/${id}`);
export const addBook = (data: any) => api.post('/books', data);
export const updateBook = (id: number, data: any) => api.patch(`/books/${id}`, data);
export const deleteBook = (id: number) => api.delete(`/books/${id}`);
export const getMyBooks = () => api.get('/books/my');

export const getCart = () => api.get('/cart');
export const addToCart = (book_id: number, quantity: number) => api.post('/cart', { book_id, quantity });
export const updateCartItem = (id: number, quantity: number) => api.patch(`/cart/${id}`, { quantity });
export const removeCartItem = (id: number) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete('/cart');

export const getOrders = () => api.get('/orders/seller');
export const updateOrderStatus = (id: number, status: string) => api.patch(`/orders/${id}`, { status });
export const createOrder = () => api.post('/orders');

export default api;
