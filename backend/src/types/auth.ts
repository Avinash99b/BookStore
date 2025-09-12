// types/auth.ts
import { IUser } from './user';

export interface IAuthResponse {
    token: string;
    user: IUser;
}
