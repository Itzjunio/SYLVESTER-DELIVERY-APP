import { Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../../types/index';
import { signVerificationToken } from '../utils/utils';

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
            required: [true, 'User role is required'], index: true
        },
        mobile: {
            type: String,
            trim: true,
        },
        validated: {
            type: Boolean,
            default: false
        },
        validateCode:{
            type: Number,
            select: false
        },
        validationCodeExpireDate:{
            type: Date,
            select: false
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
            default: 0
        },
        lockUntil: { type: Date },
        isActive: {
            type: Boolean,
            default: true,
        },
        status: {type: String, enum: ["active", "suspended"], index: true}
    },
    {
        timestamps: true,
        strict: 'throw',
    }
);



UserSchema.pre('save', async function(next) {
        const user = this;
        if (user.isModified('password') && user.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            } catch (error: any) {
                return next(error);
            }
        }
        if (user.isNew) {
            try {
                const { expiryTime, tokenDigits } = await signVerificationToken();
                user.validateCode = parseInt(tokenDigits);
                user.validationCodeExpireDate = expiryTime;
            } catch (error: any) {
                return next(error);
            }
        }
        next();
});


export const User = model<IUser>('User', UserSchema);