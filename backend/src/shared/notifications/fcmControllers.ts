import { Request, Response } from "express";
import { serializeResponse } from "../../profile";
import { saveDeviceToken } from "./fcmService";
import { IDeviceTokenValidate } from "./fcmSchemas";

export const registerDeviceToken = async (req: Request, res: Response) => {
  try {
    const parseResult = IDeviceTokenValidate.safeParse(req.body);
    if (!parseResult.success) {
      const issues = parseResult.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return res
        .status(400)
        .json(
          serializeResponse("error", null, `Invalid fields provided: ${issues}`)
        );
    }
    const { userId, role, token, platform } = parseResult.data;
    await saveDeviceToken(userId.toString(), role, token, platform);

    return res
      .status(200)
      .json(
        serializeResponse("success", "Device token registered successfully.")
      );
  } catch (error) {
    console.error("Error registering device token:", error);
    return res
      .status(500)
      .json({
        message: "An error occurred while registering the device token.",
      });
  }
};
