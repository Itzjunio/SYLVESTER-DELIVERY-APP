import { Request, Response , NextFunction} from 'express';
import { User } from './UserModels';
import { serializeResponse, ApiResponse } from '../../profile';
import { UpdateUserSchemaType, updateUserSchema } from './UserSchemas';


export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
        const err = new Error("Authentication required.") as any;
        err.statusCode = 401;
        return next(err);
    }
    const profileData = await User.findById(userId);
    if (!profileData) {
        const err = new Error("User profile not found.") as any;
        err.statusCode = 404;
        return next(err);
    }
    return res.status(200).json(serializeResponse('success', { profile: profileData }, "Profile fetched successfully."));
};



export const updateProfile = async (
    req: Request<{}, {}, UpdateUserSchemaType>,
    res: Response<ApiResponse<any | null>>,
    next: NextFunction
) => {
    const userId = req.user?._id;
    if (!userId) {
        const err = new Error("Authentication required.") as any;
        err.statusCode = 401;
        return next(err);
    }
    const parsedBody = updateUserSchema.safeParse(req.body);
    if (!parsedBody.success) {
        const issues = parsedBody.error.issues.map(issue => issue.message).join(', ');
        const err = new Error(`Invalid fields provided: ${issues}`) as any;
        err.statusCode = 400;
        return next(err);
    }
    const fieldsToUpdate = parsedBody.data;
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        fieldsToUpdate,
        { new: true, runValidators: true }
    ).select('-password');
    if (!updatedUser) {
        const err = new Error("User not found.") as any;
        err.statusCode = 404;
        return next(err);
    }
    return res.status(204).end();
};

