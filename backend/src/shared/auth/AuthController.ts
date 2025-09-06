import { authSchema, serializeResponse, ApiResponse, AuthSchemaType, IUserResponse} from './AuthSchemas.js';
import { IUser } from '../../types/index.js';
import { Request, Response } from 'express';
import { User } from '../User/UserModel.js';
import bcrypt from 'bcryptjs';
import { generateTokens, decodeToken, verifyJwtToken, signVerificationToken } from '../utils/jwt.js';
import { sendMail } from '../utils/mailer.js';
import { generateRandomToken } from '../utils/token.js';


export const register = async (
    req: Request<{}, {}, AuthSchemaType>,
    res: Response<ApiResponse<{ user: IUserResponse; accessToken: string } | null>>
): Promise<Response> => {
    try {
        const parseResult = authSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid request data',
                data: null
            });
        }

        const { email, password, role } = parseResult.data;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'User with that email already exists.',
                data: null
            });
        }

        const newUser = new User({ email, password, role });
        await newUser.save();

        const token = signVerificationToken(email);
        const link = `${process.env.APP_URL}/auth/verify?token=${token}`;
        await sendMail(email, "Verify Your Account", `<a href="${link}">Verify</a>`)

        const { accessToken, refreshToken } = generateTokens(newUser);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const userResponse: IUserResponse = {
            _id: newUser._id.toString(),
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        };

        return res.status(201).json(serializeResponse('success', {
            user: userResponse,
            accessToken,
        }, 'User registered successfully, Check email to verify'));

    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred during registration.',
            data: null
        });
    }
};

export const login = async (
    req: Request<{}, {}, AuthSchemaType>,
    res: Response<ApiResponse<{ user: IUserResponse; accessToken: string } | null>>
): Promise<Response> => {
    try {
        const { email, password, role} = req.body;
        if (!email || !role) return res.status(400).json({
            status: 'error',
            message: 'Missing fields',
            data: null
        });

        
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials',
                data: null
            });
        }
        if (user.lockUntil && user.lockUntil > new Date()) {
            return res.status(429).json({status: 'error', message: "Account locked. Try again later.", data: null });
          }
        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            user.failedAttempts += 1;

            if (user.failedAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); 
                user.failedAttempts = 0;
            }
            await user.save();
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials',
                data: null
            });
        }

        user.failedAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        const { accessToken, refreshToken } = generateTokens(user);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const userResponse: IUserResponse = {
            _id: user._id.toString(),
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return res.status(200).json(serializeResponse('success', {
            user: userResponse,
            accessToken,
        }, 'Login successful'));

    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred during login.',
            data: null
        });
    }
};

export const refreshToken = async (
    req: Request,
    res: Response<ApiResponse<{ accessToken: string } | null>>
): Promise<Response> => {
    try {
        const cookies: string | undefined = req.headers.cookie;
        const refreshTokenCookie: string | undefined = cookies?.split(';').find(c => c.trim().startsWith('refreshToken='));
        if (!refreshTokenCookie) {
            return res.status(401).json({
                status: 'error',
                message: 'Refresh token not found.',
                data: null
            });
        }

        const token: string | undefined = refreshTokenCookie.split('=')[1];
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Refresh token not found.',
                data: null
            });
        }
        const decoded = decodeToken(token);

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid refresh token: User not found.',
                data: null
            });
        }

        const { accessToken } = generateTokens(user)

        return res.status(200).json(serializeResponse('success', {
            accessToken: accessToken,
        }, 'New access token generated'));

    } catch (error: unknown) {
        console.error(error);
        if (
            typeof error === 'object' &&
            error !== null &&
            ('name' in error) &&
            ((error as { name: string }).name === 'TokenExpiredError' || (error as { name: string }).name === 'JsonWebTokenError')
        ) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            return res.status(401).json({
                status: 'error',
                message: 'Refresh token expired or invalid. Please log in again.',
                data: null
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred.',
            data: null
        });
    }
};

export const logout = async(
    _req: Request,
    res: Response<ApiResponse<null>>
): Promise<Response> => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    return res.status(204).json({
        status: 'success',
        message: 'Logout successful',
        data: null
    });
};
export const verifyUserToken = async(req: Request, res: Response)=>{

    const token = req.query.token as string;
    const payload = verifyJwtToken(token);
    if(!payload) return res.status(400). json({status: "error", message: "Invalid or expired token"});

    const user = await User.findOne({ email: payload.email});
    if(!user) return res.status(404).json({message: "User not found"});
    user.validated = true;
    await user.save();

    return res.status(201).json({message:"Email verified SUccessfully"})
}

export const forgotPassword = async(req: Request<{}, {}, IUser>, res: Response) =>{

    const {email} = req.body;
    const user = await User.findOne({email});

    if(!user) {
        return res.json({ message: " If user exist, a link was sent"});
    }
    const {raw, hashed} = generateRandomToken();
    user.resetCode = hashed;
    user.resetExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const link = `${process.env.APP_URL}/auth/reset-password?token=${raw}&email=${email}`;
    await sendMail(email, "Reset your password", `<a href="${link}">Reset Password</a>`);
  
    return res.json({ message: "If email exists, a reset link was sent." });
}

export const resetPassword = async(req: Request, res: Response)=>{

    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.resetCode || !user.resetExpiry) {
      return res.status(400).json({ message: "Invalid or expired request" });
    }
  
    const hashedInput = require("crypto").createHash("sha256").update(token).digest("hex");
  
    if (hashedInput !== user.resetCode || user.resetExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
  
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetCode = undefined;
    user.resetExpiry = undefined;

    await user.save();
  
    return res.json({ message: "Password reset successful" });
};