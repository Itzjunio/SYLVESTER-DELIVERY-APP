import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../types";
import { ApiResponse } from "../../profile";
export declare const protect: (allowedRoles?: UserRole[]) => (req: Request, res: Response<ApiResponse<any | null>>, next: NextFunction) => Response<ApiResponse<any>, Record<string, any>> | undefined;
//# sourceMappingURL=AuthMiddleware.d.ts.map