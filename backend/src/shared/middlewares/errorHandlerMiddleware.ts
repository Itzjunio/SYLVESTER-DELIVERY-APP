import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode?: number;
    data?: any;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred.';
    res.status(statusCode).json({
        success: false,
        message: message,
        data: err.data, 
    });
};

export default errorHandler;