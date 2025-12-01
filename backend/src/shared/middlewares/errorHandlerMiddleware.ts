import { Request, Response, NextFunction } from "express";
import { serializeResponse } from "../../profile";


interface CustomError extends Error {
  statusCode?: number;
  data?: any;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred.";
  res.status(statusCode).json(
    serializeResponse(
      "error",
      err.data || null,
      message
    ));
};

export default errorHandler;
