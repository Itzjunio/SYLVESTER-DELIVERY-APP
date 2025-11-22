import { Request, Response, NextFunction } from "express";
export declare const vendorDashboard: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const addItems: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const updateItem: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const getItem: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const deleteItem: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const orderStatus: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const toggleMenuItemAvailability: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const rejectOrder: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const toggleRestaurantAvailability: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=controllers.d.ts.map