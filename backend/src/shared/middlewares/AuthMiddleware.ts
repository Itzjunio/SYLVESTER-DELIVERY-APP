import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JsonWebTokenError } from "jsonwebtoken";
import { Types } from "mongoose";
import { UserRole, IAuthenticatedUser } from "../../types";
import { serializeResponse, ApiResponse } from "../../profile";
import dotenv from "dotenv";

dotenv.config();

const getAccessTokenSecret = (): Secret => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error(
      "ACCESS_TOKEN_SECRET must be defined in environment variables"
    );
  }
  return ACCESS_TOKEN_SECRET;
};

const ACCESS_TOKEN_SECRET = getAccessTokenSecret();

export const protect =
  (allowedRoles: UserRole[] = []) =>
  (
    req: Request,
    res: Response<ApiResponse<any | null>>,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json(
          serializeResponse(
            "error",
            null,
            "Access token not provided. Authorization denied."
          )
        );
    }
    try {
      const decoded = jwt.verify(
        token,
        ACCESS_TOKEN_SECRET
      ) as IAuthenticatedUser;
      req.user = {
        _id: new Types.ObjectId(decoded._id),
        role: decoded.role,
      };
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json(
            serializeResponse(
              "error",
              null,
              `Access forbidden: Insufficient permissions. ${allowedRoles}`
            )
          );
      }

      next();
    } catch (error: unknown) {
      console.error("Token verification error:", error);
      if (error instanceof JsonWebTokenError) {
        return res
          .status(401)
          .json(
            serializeResponse(
              "error",
              null,
              "Invalid or expired access token. Please log in again."
            )
          );
      }
      return res
        .status(500)
        .json(
          serializeResponse(
            "error",
            null,
            "An unexpected error occurred during token verification."
          )
        );
    }
  };
