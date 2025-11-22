import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../profile';
import { UpdateUserSchemaType } from './UserSchemas';
export declare const getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const updateProfile: (req: Request<{}, {}, UpdateUserSchemaType>, res: Response<ApiResponse<any | null>>, next: NextFunction) => Promise<void | Response<ApiResponse<any>, Record<string, any>>>;
//# sourceMappingURL=UserContollers.d.ts.map