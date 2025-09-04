import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../../types/index.js';
import jwt , {Secret} from 'jsonwebtoken';
import { Types } from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be defined in environment variables');
}
const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET as Secret;



export const protect = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1]; 

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Access token not provided. Authorization denied.'
            });
        }

        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { _id: string, role: string };
        (req as AuthenticatedRequest).user = {
            _id: new Types.ObjectId(decoded._id),
            role: decoded.role as UserRole,
        };
    next();
    return;
} catch (error: unknown) {
        console.error('Token verification error:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid access token. Please log in again.'
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred during token verification.'
        });
    }
};
