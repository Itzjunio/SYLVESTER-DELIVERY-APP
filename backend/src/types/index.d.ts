
import { Document, Schema, Types } from 'mongoose';
import { Request, Response } from 'express';


declare global {
    namespace Express {
        interface Request {
            user?: IUser | IAuthenticatedUser;
        }
    }
}

export type UserRole = 'customer' | 'vendor' | 'rider' | 'admin';

interface IRefreshTokenPayload {
    _id: string;
    role: string;
}
interface IAuthenticatedUser {
    _id: Types.ObjectId;
    role: UserRole;
}


interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    password?: string;
    role: UserRole;
    mobile?: string;
    validated: Boolean;
    validateCode?: number | undefined
    validationCodeExpireDate?: Date | undefined
    resetCode?: number | undefined;
    resetExpiry?: Date | undefined;
    failedAttempts: number;
    lockUntil?: Date | undefined ;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}


interface Iaudit extends Document{
    userId: Types.ObjectId;
    action: string;
    ip: string;
    userAgent: string;
    createdAt: Date;
}


interface ILocation {
    type: 'Point';
    coordinates: number[];
}
interface IMenuItem {
    name: string;
    description?: string;
    price: number;
    image?: string;
    category?: string;
    isAvailable?: boolean;
}

interface IOrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface IRestaurant extends Document {
    name: string;
    owner: Types.ObjectId;
    location: ILocation;
    menu: IMenuItem[];
    cuisine: string[];
    address: string;
}

interface IOrder extends Document {
    customerId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    riderId?: Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    orderStatus: 'pending' | 'accepted' | 'in-transit' | 'delivered' | 'cancelled';
    paymentMethod: string;
    deliveryAddress: string;
    createdAt: Date
    rejectionReason?: string | undefined;
    pickedUpAt?: Date;     
    deliveredAt?: Date; 
}
export  {IOrder, IRestaurant, IOrderItem, IMenuItem, ILocation, Iaudit, IUser, IAuthenticatedUser, IRefreshTokenPayload}
