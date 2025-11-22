import { IRefreshTokenPayload, IUser } from "../../types";
export declare const signVerificationToken: (duratioMinutes?: number) => Promise<{
    expiryTime: Date;
    tokenDigits: string;
}>;
export declare function decodeToken(token: string): IRefreshTokenPayload;
export declare const generateTokens: (user: IUser) => {
    accessToken: string;
    refreshToken: string;
};
export declare const forgotPasswordLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare function logAction(userId: string, action: string, req: any): void;
//# sourceMappingURL=utils.d.ts.map