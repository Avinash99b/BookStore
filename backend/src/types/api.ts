// types/api.ts
export interface IApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
