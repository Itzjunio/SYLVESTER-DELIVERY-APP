import { Request } from 'express';
import { Document, Types } from 'mongoose';


type UserRole = 'customer' | 'vendor' | 'rider' | 'admin';

// export interface AuthenticatedRequest extends Request {
//     user?: {
//         _id: Types.ObjectId;
//         role: UserRole
//     };
// }


export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    password?: string;
    role: UserRole;
    mobile?: string;
    validated: Boolean;
    resetCode?: string | undefined;
    resetExpiry?: Date | undefined;
    failedAttempts: number;
    lockUntil?: Date | undefined ;
    createdAt: Date;
    updatedAt: Date;
}

export interface Iaudit extends Document{
    userId: Types.ObjectId;
    action: string;
    ip: string;
    userAgent: string;
    createdAt: Date;
}


