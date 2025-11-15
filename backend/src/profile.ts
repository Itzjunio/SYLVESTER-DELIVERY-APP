import { IUser } from "./types";
import { Response } from "express";

export const formatUserResponse = (user: IUser) => {
  return {
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export type ApiResponse<T> = {
  status: "success" | "error";
  message?: string | undefined;
  data: T;
};

export const serializeResponse = <T>(
  status: "success" | "error",
  data: T,
  message?: string
): ApiResponse<T> => {
  return {
    status,
    message,
    data,
  };
};

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
