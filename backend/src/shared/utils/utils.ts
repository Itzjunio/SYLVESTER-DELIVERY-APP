import { IRefreshTokenPayload, IUser} from "../../types";
import rateLimit from "express-rate-limit";
import jwt, { Secret } from "jsonwebtoken";
import { AuditLog } from './schemas';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';


dotenv.config();


const getSecrets = () => {
    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, JWT_SECRET } = process.env;

    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET || !JWT_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, JWT_SECRET must be defined in environment variables');
    }

    return {
        accessTokenSecret: ACCESS_TOKEN_SECRET as Secret,
        refreshTokenSecret: REFRESH_TOKEN_SECRET as Secret,
        jwtSecret: JWT_SECRET as Secret,
    };
};


const secrets = getSecrets();

export const signVerificationToken = (email: string) => {
    return jwt.sign({ email }, secrets.jwtSecret, { expiresIn: '24h' });
};

export function verifyJwtToken(token: string): { email: string } | null {
    try {
        return jwt.verify(token, secrets.jwtSecret) as { email: string };
    } catch {
        return null;
    }
}

export function decodeToken(token: string): IRefreshTokenPayload  {
    return jwt.verify(token, secrets.refreshTokenSecret) as IRefreshTokenPayload;
}

export const generateTokens = (user: IUser): { accessToken: string; refreshToken: string } => {
    const accessToken = jwt.sign(
        { _id: user._id, role: user.role },
        secrets.accessTokenSecret,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { _id: user._id, role: user.role },
        secrets.refreshTokenSecret,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};


export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many password reset attempts. Try again later." },
});

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};


export function logAction(userId: string, action: string, req: any) {
    AuditLog.create({
        userId,
        action,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
}

export function generateRandomToken(lentgth= 32){
    const rawToken = crypto.randomBytes(lentgth).toString('hex');
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    return {rawToken , hashedToken}
}