"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.forgotPasswordLimiter = exports.generateTokens = exports.signVerificationToken = void 0;
exports.decodeToken = decodeToken;
exports.logAction = logAction;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("./models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getSecrets = () => {
    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, JWT_SECRET } = process.env;
    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET || !JWT_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, JWT_SECRET must be defined in environment variables");
    }
    return {
        accessTokenSecret: ACCESS_TOKEN_SECRET,
        refreshTokenSecret: REFRESH_TOKEN_SECRET,
        jwtSecret: JWT_SECRET,
    };
};
const secrets = getSecrets();
const signVerificationToken = async (duratioMinutes = 15) => {
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + duratioMinutes);
    const length = 6;
    const bytes = crypto_1.default.randomBytes(Math.ceil(length / 2));
    const hex = bytes.toString("hex");
    const tokenDigits = parseInt(hex, 16).toString().substring(0, length);
    return { expiryTime, tokenDigits };
};
exports.signVerificationToken = signVerificationToken;
// export function verifyJwtToken(token: string): { email: string } | null {
//     try {
//         return jwt.verify(token, secrets.jwtSecret) as { email: string };
//     } catch {
//         return null;
//     }
// }
function decodeToken(token) {
    return jsonwebtoken_1.default.verify(token, secrets.refreshTokenSecret);
}
const generateTokens = (user) => {
    const accessToken = jsonwebtoken_1.default.sign({ _id: user._id, role: user.role }, secrets.accessTokenSecret, { expiresIn: "15m" });
    const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id, role: user.role }, secrets.refreshTokenSecret, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
exports.forgotPasswordLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many password reset attempts. Try again later." },
});
const comparePassword = async (password, hashedPassword) => {
    return await bcryptjs_1.default.compare(password, hashedPassword);
};
exports.comparePassword = comparePassword;
function logAction(userId, action, req) {
    models_1.AuditLog.create({
        userId,
        action,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
}
// export function generateRandomToken(lentgth= 32){
//     const rawToken = crypto.randomBytes(lentgth).toString('hex');
//     const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
//     return {rawToken , hashedToken}
// }
//# sourceMappingURL=utils.js.map