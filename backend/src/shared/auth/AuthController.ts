import { generateRandomToken, generateTokens, decodeToken, verifyJwtToken, signVerificationToken  } from '../utils/utils';
import { setRefreshTokenCookie, serializeResponse, formatUserResponse } from '../../profile'
import { authSchema } from './AuthSchemas';
import { comparePassword } from '../utils/utils';
import { sendMail } from '../utils/emailUtils';
import { Request, Response } from 'express';
import { User } from '../User/UserModels';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'
import { z } from 'zod';


export const register = async (req: Request, res: Response) => {
    try {

        const { email, password, role } = authSchema.parse(req.body);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json(serializeResponse('error', null, 'User with that email already exists.'));
        }

        const newUser = new User({ email, password, role });
        await newUser.save();

        const token = signVerificationToken(email);
        const link = `${process.env.APP_URL}/auth/verify?token=${token}`;
        await sendMail(email, "Verify Your Account", `<a href="${link}">Verify</a>`).catch(console.error);
        const { accessToken, refreshToken } = generateTokens(newUser);
        setRefreshTokenCookie(res, refreshToken);

        const userResponse = formatUserResponse(newUser);
        return res.status(201).json(serializeResponse('success', {
            user: userResponse,
            accessToken,
        }, 'User registered successfully, check your email to verify.'));

    } catch (error) {
         if (error instanceof z.ZodError) {
                return res.status(400).json({ message: 'Invalid request body.', errors: error.issues });
            }
        console.error(error);
        return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred during registration.'));
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = authSchema.parse(req.body);
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await comparePassword(password, user.password as string))) {
            if (user) {
                user.failedAttempts = (user.failedAttempts || 0) + 1;
                if (user.failedAttempts >= 5) {
                    user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
                    user.failedAttempts = 0;
                }
                await user.save();
            }
            return res.status(401).json(serializeResponse('error', null, 'Invalid credentials.'));
        }
        if (user.lockUntil && user.lockUntil > new Date()) {
            return res.status(429).json(serializeResponse('error', null, 'Account locked. Try again later.'));
        }

        user.failedAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        const { accessToken, refreshToken } = generateTokens(user);
        setRefreshTokenCookie(res, refreshToken);
        const userResponse = formatUserResponse(user);
        return res.status(200).json(serializeResponse('success', {
            user: userResponse,
            accessToken,
        }, 'Login successful.'));
    } catch (error) {
             if (error instanceof z.ZodError) {
                    return res.status(400).json({ message: 'Invalid request body.', errors: error.issues });
                }
        console.error(error);
        return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred during login.'));
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken;
        if (!refreshTokenCookie) {
            return res.status(401).json(serializeResponse('error', null, 'Refresh token not found.'));
        }

        const decoded = decodeToken(refreshTokenCookie);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json(serializeResponse('error', null, 'Invalid refresh token: User not found.'));
        }

        const { accessToken } = generateTokens(user);
        return res.status(200).json(serializeResponse('success', {
            accessToken,
        }, 'New access token generated.'));

    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error && (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError')) {
            res.clearCookie('refreshToken');
            return res.status(401).json(serializeResponse('error', null, 'Refresh token expired or invalid. Please log in again.'));
        }
        return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
    }
};

export const logout = async (_req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    return res.status(204).json(serializeResponse('success', null, 'Logout successful.'));
};

export const verifyUserToken = async (req: Request, res: Response) => {
    try {
        const token = req.query.token as string;
        if (!token) {
            return res.status(400).json(serializeResponse('error', null, 'Token not provided.'));
        }
        const payload = verifyJwtToken(token);
        if (!payload) {
            return res.status(400).json(serializeResponse('error', null, 'Invalid or expired token.'));
        }

        const user = await User.findOne({ email: payload.email });
        if (!user) {
            return res.status(404).json(serializeResponse('error', null, 'User not found.'));
        }
        user.validated = true;
        await user.save();
        return res.status(201).json(serializeResponse('success', null, 'Email verified successfully.'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json(serializeResponse('success', null, 'If a user exists, a password reset link has been sent to their email.'));
        }

        const {rawToken, hashedToken} = generateRandomToken();
        user.resetCode = hashedToken;
        user.resetExpiry = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        const link = `${process.env.APP_URL}/auth/reset-password?token=${rawToken}&email=${email}`;
        await sendMail(email, "Reset your password", `<a href="${link}">Reset Password</a>`);

        return res.json(serializeResponse('success', null, 'If a user exists, a reset link was sent.'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, token, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.resetCode || !user.resetExpiry) {
            return res.status(400).json(serializeResponse('error', null, 'Invalid or expired request.'));
        }

        const hashedInputToken = crypto.createHash("sha256").update(token).digest("hex");
        if (hashedInputToken !== user.resetCode || user.resetExpiry < new Date()) {
            return res.status(400).json(serializeResponse('error', null, 'Invalid or expired token.'));
        }
        user.password = await bcrypt.hash(newPassword, 12);
        user.resetCode = undefined;
        user.resetExpiry = undefined;
        await user.save();

        return res.status(200).json(serializeResponse('success', null, 'Password reset successful.'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(serializeResponse('error', null, 'An unexpected error occurred.'));
    }
};
