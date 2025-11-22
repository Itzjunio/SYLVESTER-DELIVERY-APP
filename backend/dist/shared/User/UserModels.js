"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../utils/utils");
const UserSchema = new mongoose_1.Schema({
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
    validateCode: {
        type: Number,
        select: false
    },
    validationCodeExpireDate: {
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
    status: { type: String, enum: ["active", "suspended"], index: true }
}, {
    timestamps: true,
    strict: 'throw',
});
UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password') && user.password) {
        try {
            const salt = await bcryptjs_1.default.genSalt(10);
            user.password = await bcryptjs_1.default.hash(user.password, salt);
        }
        catch (error) {
            return next(error);
        }
    }
    if (user.isNew) {
        try {
            const { expiryTime, tokenDigits } = await (0, utils_1.signVerificationToken)();
            user.validateCode = parseInt(tokenDigits);
            user.validationCodeExpireDate = expiryTime;
        }
        catch (error) {
            return next(error);
        }
    }
    next();
});
exports.User = (0, mongoose_1.model)('User', UserSchema);
//# sourceMappingURL=UserModels.js.map