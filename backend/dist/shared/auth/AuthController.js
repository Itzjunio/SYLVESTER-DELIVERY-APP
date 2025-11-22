"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerificationCode = exports.resetPassword = exports.forgotPassword = exports.verifyUserAccount = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const utils_1 = require("../utils/utils");
const profile_1 = require("../../profile");
const AuthSchemas_1 = require("./AuthSchemas");
const emailUtils_1 = require("../utils/emailUtils");
const UserModels_1 = require("../User/UserModels");
const fcmService_1 = require("../notifications/fcmService");
const validators_1 = require("../utils/validators");
const register = async (req, res, next) => {
    const authBodyParser = AuthSchemas_1.authSchema.safeParse(req.body);
    if (!authBodyParser.success) {
        const issues = authBodyParser.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { email, password, role } = authBodyParser.data;
    const existingUser = await UserModels_1.User.findOne({ email });
    if (existingUser) {
        const err = new Error("User with that email already exists.");
        err.statusCode = 409;
        return next(err);
    }
    const newUser = new UserModels_1.User({ email, password, role });
    await newUser.save();
    const savedUser = await UserModels_1.User.findById(newUser._id).select("+validateCode");
    if (savedUser && savedUser.validateCode) {
        await (0, emailUtils_1.sendMail)(savedUser.email, "Verify your account", `Your verification code is: ${savedUser.validateCode}`).catch(console.error);
    }
    const { accessToken, refreshToken } = (0, utils_1.generateTokens)(newUser);
    (0, profile_1.setRefreshTokenCookie)(res, refreshToken);
    const userResponse = (0, profile_1.formatUserResponse)(newUser);
    return res
        .status(201)
        .json((0, profile_1.serializeResponse)("success", { user: userResponse, accessToken }, "User registered successfully, check your email to verify."));
};
exports.register = register;
const login = async (req, res, next) => {
    const loginBodyParser = AuthSchemas_1.authSchema.safeParse(req.body);
    if (!loginBodyParser.success) {
        const issues = loginBodyParser.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { email, password } = loginBodyParser.data;
    const user = await UserModels_1.User.findOne({ email }).select("+password");
    if (!user) {
        const err = new Error("Invalid credentials.");
        err.statusCode = 401;
        return next(err);
    }
    if (!user.validated) {
        const err = new Error("Account not validated. Please verify your email.");
        err.statusCode = 403;
        return next(err);
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
        const err = new Error("Account locked. Try again later.");
        err.statusCode = 429;
        return next(err);
    }
    if (!(await (0, utils_1.comparePassword)(password, user.password))) {
        user.failedAttempts = (user.failedAttempts || 0) + 1;
        if (user.failedAttempts >= 5) {
            user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
            user.failedAttempts = 0;
        }
        await user.save();
        const err = new Error("Invalid credentials.");
        err.statusCode = 401;
        return next(err);
    }
    user.failedAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    const { accessToken, refreshToken } = (0, utils_1.generateTokens)(user);
    (0, profile_1.setRefreshTokenCookie)(res, refreshToken);
    const userResponse = (0, profile_1.formatUserResponse)(user);
    return res.status(200).json((0, profile_1.serializeResponse)("success", {
        user: userResponse,
        accessToken,
    }, "Login successful."));
};
exports.login = login;
const refreshToken = async (req, res, next) => {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie) {
        const err = new Error("Refresh token not found.");
        err.statusCode = 401;
        return next(err);
    }
    try {
        const decoded = (0, utils_1.decodeToken)(refreshTokenCookie);
        const user = await UserModels_1.User.findById(decoded._id);
        if (!user) {
            const err = new Error("Invalid refresh token: User not found.");
            err.statusCode = 401;
            return next(err);
        }
        const { accessToken } = (0, utils_1.generateTokens)(user);
        return res.status(200).json((0, profile_1.serializeResponse)("success", {
            accessToken,
        }, "New access token generated."));
    }
    catch (error) {
        if (error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError") {
            res.clearCookie("refreshToken");
            const err = new Error("Refresh token expired or invalid. Please log in again.");
            err.statusCode = 401;
            return next(err);
        }
        return next(error);
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res, next) => {
    const token = req.user?._id;
    const role = req.user?.role;
    if (!token || !role) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    (0, validators_1.isValidObjectId)(token.toString());
    await (0, fcmService_1.unSubscribeToTopic)(token.toString(), role);
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return res.status(204).end();
};
exports.logout = logout;
const verifyUserAccount = async (req, res, next) => {
    const verifyUserAccountBodyParser = AuthSchemas_1.verifyUserAccountSchema.safeParse(req.body);
    if (!verifyUserAccountBodyParser.success) {
        const issues = verifyUserAccountBodyParser.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { email, validateCode } = verifyUserAccountBodyParser.data;
    if (!validateCode) {
        const err = new Error("Token not provided.");
        err.statusCode = 400;
        return next(err);
    }
    const user = await UserModels_1.User.findOne({ email });
    if (!user) {
        const err = new Error("User not found.");
        err.statusCode = 404;
        return next(err);
    }
    if (user.validated) {
        const err = new Error("Account already validated");
        err.statusCode = 400;
        return next(err);
    }
    if (user.validateCode !== validateCode) {
        const err = new Error("Invalid verification code.");
        err.statusCode = 400;
        return next(err);
    }
    if (user.validationCodeExpireDate &&
        user.validationCodeExpireDate < new Date()) {
        const err = new Error("Verification code has expired.");
        err.statusCode = 400;
        return next(err);
    }
    user.validated = true;
    await user.save();
    return res
        .status(201)
        .json((0, profile_1.serializeResponse)("success", null, "Account validated successfully. You can log in. "));
};
exports.verifyUserAccount = verifyUserAccount;
const forgotPassword = async (req, res, next) => {
    const forgetPasswordBodyParser = AuthSchemas_1.forgetPasswordSchema.safeParse(req.body);
    if (!forgetPasswordBodyParser.success) {
        const issues = forgetPasswordBodyParser.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { email } = forgetPasswordBodyParser.data;
    const user = await UserModels_1.User.findOne({ email }).select("+resetCode +resetExpiry");
    if (!user) {
        return res
            .status(200)
            .json((0, profile_1.serializeResponse)("success", null, "If a user exists, a password reset link has been sent to their email."));
    }
    const { expiryTime, tokenDigits } = await (0, utils_1.signVerificationToken)(3);
    user.resetCode = parseInt(tokenDigits);
    user.resetExpiry = expiryTime;
    await user.save();
    await (0, emailUtils_1.sendMail)(email, "Reset your password", `Reset password code: ${tokenDigits}`).catch(console.error);
    return res
        .status(200)
        .json((0, profile_1.serializeResponse)("success", null, "If a user exists, a reset link was sent."));
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    const resetPasswordBodyParser = AuthSchemas_1.resetPasswordSchema.safeParse(req.body);
    if (!resetPasswordBodyParser.success) {
        const issues = resetPasswordBodyParser.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { email, validateCode, newPassword } = resetPasswordBodyParser.data;
    const user = await UserModels_1.User.findOne({ email }).select("+resetCode +resetExpiry");
    if (!user) {
        const err = new Error("User not found.");
        err.statusCode = 404;
        return next(err);
    }
    if (!user.resetCode || !user.resetExpiry) {
        const err = new Error("Invalid or expired request.");
        err.statusCode = 400;
        return next(err);
    }
    if (user.resetExpiry && user.resetExpiry < new Date()) {
        const err = new Error("Reset code has expired.");
        err.statusCode = 400;
        return next(err);
    }
    if (user.resetCode !== validateCode) {
        const err = new Error("Invalid or expired token.");
        err.statusCode = 400;
        return next(err);
    }
    user.password = newPassword;
    user.resetCode = undefined;
    user.resetExpiry = undefined;
    await user.save();
    return res
        .status(200)
        .json((0, profile_1.serializeResponse)("success", null, "Password reset successful."));
};
exports.resetPassword = resetPassword;
const resendVerificationCode = async (req, res, next) => {
    const resendVerificationCodeBodyParser = AuthSchemas_1.resendVerificationCodeSchema.safeParse(req.body);
    if (!resendVerificationCodeBodyParser.success) {
        const issues = resendVerificationCodeBodyParser.error.issues
            .map((issue) => issue.message)
            .join(", ");
        const err = new Error(`Invalid request body: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const { email } = resendVerificationCodeBodyParser.data;
    const user = await UserModels_1.User.findOne({ email }).select("+validateCode +validationCodeExpireDate");
    if (!user) {
        const err = new Error("User not found.");
        err.statusCode = 404;
        return next(err);
    }
    if (user.validated) {
        const err = new Error("Account is already validated.");
        err.statusCode = 400;
        return next(err);
    }
    const { expiryTime, tokenDigits } = await (0, utils_1.signVerificationToken)();
    const newCode = parseInt(tokenDigits);
    const newExpiry = expiryTime;
    user.validateCode = newCode;
    user.validationCodeExpireDate = newExpiry;
    await user.save();
    await (0, emailUtils_1.sendMail)(user.email, "New Verification Code", `Your new verification code is: ${newCode}`).catch(console.error);
    return res
        .status(200)
        .json((0, profile_1.serializeResponse)("success", null, "A new verification code has been sent to your email."));
};
exports.resendVerificationCode = resendVerificationCode;
//# sourceMappingURL=AuthController.js.map