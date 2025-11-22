"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshTokenCookie = exports.serializeResponse = exports.formatUserResponse = void 0;
const formatUserResponse = (user) => {
    return {
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
exports.formatUserResponse = formatUserResponse;
const serializeResponse = (status, data, message) => {
    return {
        status,
        message,
        data,
    };
};
exports.serializeResponse = serializeResponse;
const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
exports.setRefreshTokenCookie = setRefreshTokenCookie;
//# sourceMappingURL=profile.js.map