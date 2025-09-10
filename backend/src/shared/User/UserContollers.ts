import { Request, Response } from 'express';
import { User } from './UserModels';
import { serializeResponse, ApiResponse } from '../../types/index';
import { UpdateUserSchemaType, updateUserSchema } from './UserSchemas';


export const getProfile = async (req: Request, res: Response<ApiResponse<any | null>>) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json(serializeResponse('error', null, "Authentication required."));
        }
        const profileData = await User.findById(userId).select('-password');
        if (!profileData) {
            return res.status(404).json(serializeResponse('error', null, "User profile not found."));
        }
        return res.status(200).json(serializeResponse('success', { profile: profileData }, "Profile fetched successfully."));

    } catch (error: unknown) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json(serializeResponse('error', null, "An unexpected error occurred."));
    }
};

export const updateProfile = async (
    req: Request<{}, {}, UpdateUserSchemaType>,
    res: Response<ApiResponse<any | null>>
) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json(serializeResponse('error', null, "Authentication required."));
        }

        const parsedBody = updateUserSchema.safeParse(req.body);
        if (!parsedBody.success) {
            const issues = parsedBody.error.issues.map(issue => issue.message).join(', ');
            return res.status(400).json(serializeResponse('error', null, `Invalid fields provided: ${issues}`));
        }
        const fieldsToUpdate = parsedBody.data;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            fieldsToUpdate,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json(serializeResponse('error', null, "User not found."));
        }
        return res.status(200).json(serializeResponse('success', updatedUser, "Profile updated successfully."));
        
    } catch (error: unknown) {
        console.error('Error updating profile:', error);
        return res.status(500).json(serializeResponse('error', null, "An unexpected error occurred."));
    }
};