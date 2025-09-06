import { Request, Response } from 'express';

import { saveDeviceToken } from "./fcmService.js";
import { IDeviceToken } from './fcmModels.js';


export const registerDeviceToken = async (req: Request<{}, {}, IDeviceToken>, res: Response) => {
    try {
        const { userId, role, token, platform } = req.body;
        

        if (!token || !platform || !userId || !role) {
            return res.status(400).json({ 
                message: "Token, platform, userId, and userRole are required." 
            });
        }
        await saveDeviceToken(userId.toString(), role, token, platform);
        
        return res.status(200).json({ message: "Device token registered successfully." });

    } catch (error) {
        console.error("Error registering device token:", error);
        return res.status(500).json({ message: "An error occurred while registering the device token." });
    }
};
