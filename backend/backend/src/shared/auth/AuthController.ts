import { Request, Response, NextFunction } from "express";
import {
  generateTokens,
  decodeToken,
  signVerificationToken,
  comparePassword,
} from "../utils/utils";
import {
  setRefreshTokenCookie,
  serializeResponse,
  formatUserResponse,
} from "../../profile";
import {
  authSchema,
  forgetPasswordSchema,
  resendVerificationCodeSchema,
  resetPasswordSchema,
  verifyUserAccountSchema,
} from "./AuthSchemas";
import { sendMail } from "../utils/emailUtils";
import { User } from "../User/UserModels";
import { unSubscribeToTopic } from "../notifications/fcmService";
import { isValidObjectId } from "../utils/validators";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authBodyParser = authSchema.safeParse(req.body);
  if (!authBodyParser.success) {
    const issues = authBodyParser.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { email, password, role } = authBodyParser.data;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error("User with that email already exists.") as any;
    err.statusCode = 409;
    return next(err);
  }
  const newUser = new User({ email, password, role });
  await newUser.save();

  const savedUser = await User.findById(newUser._id).select("+validateCode");
  if (savedUser && savedUser.validateCode) {
    await sendMail(
      savedUser.email,
      "Verify your account",
      `Your verification code is: ${savedUser.validateCode}`
    ).catch(console.error);
  }

  const { accessToken, refreshToken } = generateTokens(newUser);
  setRefreshTokenCookie(res, refreshToken);

  const userResponse = formatUserResponse(newUser);
  return res
    .status(201)
    .json(
      serializeResponse(
        "success",
        { user: userResponse, accessToken },
        "User registered successfully, check your email to verify."
      )
    );
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginBodyParser = authSchema.safeParse(req.body);
  if (!loginBodyParser.success) {
    const issues = loginBodyParser.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { email, password } = loginBodyParser.data;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const err = new Error("Invalid credentials.") as any;
    err.statusCode = 401;
    return next(err);
  }
  if (!user.validated) {
    const err = new Error(
      "Account not validated. Please verify your email."
    ) as any;
    err.statusCode = 403;
    return next(err);
  }
  if (user.lockUntil && user.lockUntil > new Date()) {
    const err = new Error("Account locked. Try again later.") as any;
    err.statusCode = 429;
    return next(err);
  }
  if (!(await comparePassword(password, user.password as string))) {
    user.failedAttempts = (user.failedAttempts || 0) + 1;
    if (user.failedAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      user.failedAttempts = 0;
    }
    await user.save();
    const err = new Error("Invalid credentials.") as any;
    err.statusCode = 401;
    return next(err);
  }

  user.failedAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  const { accessToken, refreshToken } = generateTokens(user);
  setRefreshTokenCookie(res, refreshToken);
  const userResponse = formatUserResponse(user);

  return res.status(200).json(
    serializeResponse(
      "success",
      {
        user: userResponse,
        accessToken,
      },
      "Login successful."
    )
  );
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshTokenCookie = req.cookies.refreshToken;
  if (!refreshTokenCookie) {
    const err = new Error("Refresh token not found.") as any;
    err.statusCode = 401;
    return next(err);
  }

  try {
    const decoded = decodeToken(refreshTokenCookie);
    const user = await User.findById(decoded._id);
    if (!user) {
      const err = new Error("Invalid refresh token: User not found.") as any;
      err.statusCode = 401;
      return next(err);
    }

    const { accessToken } = generateTokens(user);
    return res.status(200).json(
      serializeResponse(
        "success",
        {
          accessToken,
        },
        "New access token generated."
      )
    );
  } catch (error: any) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      res.clearCookie("refreshToken");
      const err = new Error(
        "Refresh token expired or invalid. Please log in again."
      ) as any;
      err.statusCode = 401;
      return next(err);
    }
    return next(error);
  }
};

export const logout = async(req: Request, res: Response, next: NextFunction) => {
  const token = req.user?._id;
  const role = req.user?.role;
  if (!token || !role) {
    const err = new Error("Authentication required.") as any;
    err.statusCode = 401;
    return next(err);
  }
  isValidObjectId(token.toString())
  await unSubscribeToTopic(token.toString(), role);
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(204).end();
};

export const verifyUserAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const verifyUserAccountBodyParser = verifyUserAccountSchema.safeParse(
    req.body
  );
  if (!verifyUserAccountBodyParser.success) {
    const issues = verifyUserAccountBodyParser.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { email, validateCode } = verifyUserAccountBodyParser.data;
  if (!validateCode) {
    const err = new Error("Token not provided.") as any;
    err.statusCode = 400;
    return next(err);
  }

  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("User not found.") as any;
    err.statusCode = 404;
    return next(err);
  }
  if (user.validated) {
    const err = new Error("Account already validated") as any;
    err.statusCode = 400;
    return next(err);
  }
  if (user.validateCode !== validateCode) {
    const err = new Error("Invalid verification code.") as any;
    err.statusCode = 400;
    return next(err);
  }
  if (
    user.validationCodeExpireDate &&
    user.validationCodeExpireDate < new Date()
  ) {
    const err = new Error("Verification code has expired.") as any;
    err.statusCode = 400;
    return next(err);
  }
  user.validated = true;
  await user.save();
  return res
    .status(201)
    .json(
      serializeResponse(
        "success",
        null,
        "Account validated successfully. You can log in. "
      )
    );
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const forgetPasswordBodyParser = forgetPasswordSchema.safeParse(req.body);
  if (!forgetPasswordBodyParser.success) {
    const issues = forgetPasswordBodyParser.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { email } = forgetPasswordBodyParser.data;
  const user = await User.findOne({ email }).select("+resetCode +resetExpiry");

  if (!user) {
    return res
      .status(200)
      .json(
        serializeResponse(
          "success",
          null,
          "If a user exists, a password reset link has been sent to their email."
        )
      );
  }

  const { expiryTime, tokenDigits } = await signVerificationToken(3);
  user.resetCode = parseInt(tokenDigits);
  user.resetExpiry = expiryTime;
  await user.save();
  await sendMail(
    email,
    "Reset your password",
    `Reset password code: ${tokenDigits}`
  ).catch(console.error);

  return res
    .status(200)
    .json(
      serializeResponse(
        "success",
        null,
        "If a user exists, a reset link was sent."
      )
    );
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resetPasswordBodyParser = resetPasswordSchema.safeParse(req.body);
  if (!resetPasswordBodyParser.success) {
    const issues = resetPasswordBodyParser.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { email, validateCode, newPassword } = resetPasswordBodyParser.data;
  const user = await User.findOne({ email }).select("+resetCode +resetExpiry");

  if (!user) {
    const err = new Error("User not found.") as any;
    err.statusCode = 404;
    return next(err);
  }
  if (!user.resetCode || !user.resetExpiry) {
    const err = new Error("Invalid or expired request.") as any;
    err.statusCode = 400;
    return next(err);
  }
  if (user.resetExpiry && user.resetExpiry < new Date()) {
    const err = new Error("Reset code has expired.") as any;
    err.statusCode = 400;
    return next(err);
  }
  if (user.resetCode !== validateCode) {
    const err = new Error("Invalid or expired token.") as any;
    err.statusCode = 400;
    return next(err);
  }
  user.password = newPassword;
  user.resetCode = undefined;
  user.resetExpiry = undefined;
  await user.save();
  return res
    .status(200)
    .json(serializeResponse("success", null, "Password reset successful."));
};

export const resendVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resendVerificationCodeBodyParser =
    resendVerificationCodeSchema.safeParse(req.body);
  if (!resendVerificationCodeBodyParser.success) {
    const issues = resendVerificationCodeBodyParser.error.issues
      .map((issue) => issue.message)
      .join(", ");
    const err = new Error(`Invalid request body: ${issues}`) as any;
    err.statusCode = 400;
    return next(err);
  }
  const { email } = resendVerificationCodeBodyParser.data;
  const user = await User.findOne({ email }).select(
    "+validateCode +validationCodeExpireDate"
  );
  if (!user) {
    const err = new Error("User not found.") as any;
    err.statusCode = 404;
    return next(err);
  }
  if (user.validated) {
    const err = new Error("Account is already validated.") as any;
    err.statusCode = 400;
    return next(err);
  }
  const { expiryTime, tokenDigits } = await signVerificationToken();
  const newCode = parseInt(tokenDigits);
  const newExpiry = expiryTime;

  user.validateCode = newCode;
  user.validationCodeExpireDate = newExpiry;
  await user.save();
  await sendMail(
    user.email,
    "New Verification Code",
    `Your new verification code is: ${newCode}`
  ).catch(console.error);

  return res
    .status(200)
    .json(
      serializeResponse(
        "success",
        null,
        "A new verification code has been sent to your email."
      )
    );
};
