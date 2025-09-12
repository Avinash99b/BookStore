// controllers/AuthController.ts
import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import jwt ,{SignOptions} from 'jsonwebtoken';
import { IUserRegisterDTO, IUserJWT } from '../types/user';
import { IAuthResponse } from '../types/auth';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const data: IUserRegisterDTO = req.body;
            if (!data.name || !data.email || !data.password) {
                return res.status(400).json({ error: 'name, email, password required' });
            }

            // Check if user exists
            const existing = await UserModel.findByEmail(data.email);
            if (existing) return res.status(400).json({ error: 'Email already registered' });

            const user = await UserModel.create(data);

            const payload: IUserJWT = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);

            const response: IAuthResponse = { token, user: payload };
            return res.status(201).json(response);
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: 'email and password required' });

            const user = await UserModel.findByEmail(email);
            if (!user) return res.status(400).json({ error: 'Invalid credentials' });

            const match = await bcrypt.compare(password, user.password_hash);
            if (!match) return res.status(400).json({ error: 'Invalid credentials' });

            const payload: IUserJWT = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);

            const response: IAuthResponse = { token, user: payload };
            return res.json(response);
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }
}
