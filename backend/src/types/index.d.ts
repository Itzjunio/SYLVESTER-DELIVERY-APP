import { Request } from 'express';
import { Document, Types } from 'mongoose';


type UserRole = 'customer' | 'vendor' | 'rider' | 'admin';

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: Types.ObjectId;
        role: UserRole
    };
}


export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    password?: string;
    role: UserRole;
    mobile?: string;
    verificationCode: string;
    verificationCodeValidation: Number;
    forgotPassward: string;
    forgotPasswardValidation: Number;
    createdAt: Date;
    updatedAt: Date;
}

