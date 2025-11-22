import { IUser } from "./types";
import { Response } from "express";
export declare const formatUserResponse: (user: IUser) => {
    _id: string;
    email: string;
    role: import("./types").UserRole;
    createdAt: Date;
    updatedAt: Date;
};
export type ApiResponse<T> = {
    status: "success" | "error";
    message?: string | undefined;
    data: T;
};
export declare const serializeResponse: <T>(status: "success" | "error", data: T, message?: string) => ApiResponse<T>;
export declare const setRefreshTokenCookie: (res: Response, refreshToken: string) => void;
//# sourceMappingURL=profile.d.ts.map