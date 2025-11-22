"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riderPerformanceSchema = void 0;
const zod_1 = require("zod");
exports.riderPerformanceSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    riderId: zod_1.z.string().optional(),
});
//# sourceMappingURL=schema.js.map