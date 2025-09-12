import jwt from "jsonwebtoken";
import {Request,Response,NextFunction} from "express"
import {IUserJWT} from "../types/user";
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET in env');

export function authenticateJWT(req:Request, res:Response, next:NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Malformed Authorization header' });

    try {
        const payload = jwt.verify(token, JWT_SECRET as string);
        // payload should include { id, email, role, name }
        req.user = payload as IUserJWT;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

function requireRole(role:string) {
    return (req:Request, res:Response, next:NextFunction) => {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden: wrong role' });
        next();
    };
}

