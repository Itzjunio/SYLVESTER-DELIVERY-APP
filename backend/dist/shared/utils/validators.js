"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidObjectId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const isValidObjectId = (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid ID format.");
        err.statusCode = 400;
        throw err;
    }
};
exports.isValidObjectId = isValidObjectId;
//# sourceMappingURL=validators.js.map