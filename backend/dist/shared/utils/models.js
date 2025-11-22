"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const mongoose_1 = require("mongoose");
const auditSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId },
    action: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now },
});
exports.AuditLog = (0, mongoose_1.model)("AuditLog", auditSchema);
//# sourceMappingURL=models.js.map