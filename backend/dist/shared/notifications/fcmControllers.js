"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDeviceToken = void 0;
const profile_1 = require("../../profile");
const fcmService_1 = require("./fcmService");
const fcmSchemas_1 = require("./fcmSchemas");
const registerDeviceToken = async (req, res) => {
    try {
        const parseResult = fcmSchemas_1.IDeviceTokenValidate.safeParse(req.body);
        if (!parseResult.success) {
            const issues = parseResult.error.issues
                .map((issue) => issue.message)
                .join(", ");
            return res
                .status(400)
                .json((0, profile_1.serializeResponse)("error", null, `Invalid fields provided: ${issues}`));
        }
        const { userId, role, token, platform } = parseResult.data;
        await (0, fcmService_1.saveDeviceToken)(userId.toString(), role, token, platform);
        return res
            .status(200)
            .json((0, profile_1.serializeResponse)("success", "Device token registered successfully."));
    }
    catch (error) {
        console.error("Error registering device token:", error);
        return res
            .status(500)
            .json({
            message: "An error occurred while registering the device token.",
        });
    }
};
exports.registerDeviceToken = registerDeviceToken;
//# sourceMappingURL=fcmControllers.js.map