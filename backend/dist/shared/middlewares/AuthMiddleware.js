"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const profile_1 = require("../../profile");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAccessTokenSecret = () => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    if (!ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET must be defined in environment variables");
    }
    return ACCESS_TOKEN_SECRET;
};
const ACCESS_TOKEN_SECRET = getAccessTokenSecret();
const protect = (allowedRoles = []) => (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json((0, profile_1.serializeResponse)("error", null, "Access token not provided. Authorization denied."));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        req.user = {
            _id: new mongoose_1.Types.ObjectId(decoded._id),
            role: decoded.role,
        };
        if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
            return res
                .status(403)
                .json((0, profile_1.serializeResponse)("error", null, `Access forbidden: Insufficient permissions. ${allowedRoles}`));
        }
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res
                .status(401)
                .json((0, profile_1.serializeResponse)("error", null, "Invalid or expired access token. Please log in again."));
        }
        return res
            .status(500)
            .json((0, profile_1.serializeResponse)("error", null, "An unexpected error occurred during token verification."));
    }
};
exports.protect = protect;
//# sourceMappingURL=AuthMiddleware.js.map