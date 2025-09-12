// types/user.ts
export type UserRole = 'buyer' | 'seller';

export interface IUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    created_at?: string; // ISO date string
}

export interface IUserAuth extends IUser {
    password: string; // used for registration/login
}

export interface IUserRegisterDTO {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

export interface IUserLoginDTO {
    email: string;
    password: string;
}

export interface IUserJWT {
    id: number;
    email: string;
    name: string;
    role: UserRole;
}
