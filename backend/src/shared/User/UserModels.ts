import { Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../../types/index';

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: [true, "Email alreadt exist"],
            minLength: [5, "Email must have 5 or more characters"],
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            trim: true,
            select: false, 
        },
        role: {
            type: String,
            enum: ['customer', 'vendor', 'rider', 'admin'],
            required: [true, 'User role is required'],
        },
        mobile: {
            type: String,
            trim: true,
        },
        validated: {
            type: Boolean,
            default: false
        },
        resetCode: {
            type: String,
            select: false
        },
        
        resetExpiry: {
            type: Date,
            select: false
        },
        failedAttempts: {
            type: Number,
            default: 0 },
        lockUntil: { type: Date },

    },
    {
        timestamps: true, 
        strict: 'throw', 
    }
);


UserSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});


export const User = model<IUser>('User', UserSchema);