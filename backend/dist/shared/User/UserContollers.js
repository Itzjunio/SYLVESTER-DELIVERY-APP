"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const UserModels_1 = require("./UserModels");
const profile_1 = require("../../profile");
const UserSchemas_1 = require("./UserSchemas");
const getProfile = async (req, res, next) => {
    const userId = req.user?._id;
    if (!userId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    const profileData = await UserModels_1.User.findById(userId);
    if (!profileData) {
        const err = new Error("User profile not found.");
        err.statusCode = 404;
        return next(err);
    }
    return res.status(200).json((0, profile_1.serializeResponse)('success', { profile: profileData }, "Profile fetched successfully."));
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    const userId = req.user?._id;
    if (!userId) {
        const err = new Error("Authentication required.");
        err.statusCode = 401;
        return next(err);
    }
    const parsedBody = UserSchemas_1.updateUserSchema.safeParse(req.body);
    if (!parsedBody.success) {
        const issues = parsedBody.error.issues.map(issue => issue.message).join(', ');
        const err = new Error(`Invalid fields provided: ${issues}`);
        err.statusCode = 400;
        return next(err);
    }
    const fieldsToUpdate = parsedBody.data;
    const updatedUser = await UserModels_1.User.findByIdAndUpdate(userId, fieldsToUpdate, { new: true, runValidators: true }).select('-password');
    if (!updatedUser) {
        const err = new Error("User not found.");
        err.statusCode = 404;
        return next(err);
    }
    return res.status(204).end();
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=UserContollers.js.map