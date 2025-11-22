import { Request, Response, NextFunction } from "express";
interface CustomError extends Error {
    statusCode?: number;
    data?: any;
}
declare const errorHandler: (err: CustomError, req: Request, res: Response, next: NextFunction) => void;
export default errorHandler;
//# sourceMappingURL=errorHandlerMiddleware.d.ts.map