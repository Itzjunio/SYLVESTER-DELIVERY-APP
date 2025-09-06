import { Request, Response } from 'express';
import { User } from './UserModel.js';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const userRole = req.user?.role;

        if (!userId || !userRole) {
            return res.status(401).json({ message: "User not authenticated or role not defined." });
        }

        let profileData;

        switch (userRole) {
            case 'customer':
                profileData = await User.findById(userId).select('-password');
                break;
            case 'vendor':
                profileData = await User.findById(userId).select('-password');
                break;
            case 'rider':
                profileData = await User.findById(userId).select('-password');
                break;
            default:
                return res.status(400).json({ message: "Invalid user role." });
        }

        if (!profileData) {
            return res.status(404).json({ message: "User profile not found." });
        }

        return res.status(200).json({ profile: profileData });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "An error occurred while fetching the user profile." });
    }
};
