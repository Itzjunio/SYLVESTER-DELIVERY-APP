import { Request, Response, NextFunction } from "express";
export declare const adminStats: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const users: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const orders: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getRiderPerformanceReport: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const deactivateUser: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const getAllRidersPerformanceReport: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const assignRider: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const commission: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const notify: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const disputes: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const resolveDispute: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=controllers.d.ts.map