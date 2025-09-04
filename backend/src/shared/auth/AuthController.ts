import { authSchema, serializeResponse, ApiResponse, AuthSchemaType, IUserResponse} from './AuthSchemas.js';
import { AuthenticatedRequest, IUser } from '../../types/index.js';
import { Request, Response } from 'express';
import { User } from './UserModel.js';
import jwt, {Secret} from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';


dotenv.config();


if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be defined in environment variables');
}
const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET as Secret;
const REFRESH_TOKEN_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET as Secret;

const generateTokens = (user: IUser): { accessToken: string; refreshToken: string } => {
    const accessToken = jwt.sign(
        { _id: user._id, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { _id: user._id, role: user.role },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

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
        }, 'User registered successfully'));

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
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials',
                data: null
            });
        }
        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials',
                data: null
            });
        }

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
    req: AuthenticatedRequest,
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
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { _id: string; role: string };

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid refresh token: User not found.',
                data: null
            });
        }

        const newAccessToken = jwt.sign(
            { _id: user._id, role: user.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        return res.status(200).json(serializeResponse('success', {
            accessToken: newAccessToken,
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

export const logout = (
    _req: Request,
    res: Response<ApiResponse<null>>
): Response => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    return res.status(200).json({
        status: 'success',
        message: 'Logout successful',
        data: null
    });
};
