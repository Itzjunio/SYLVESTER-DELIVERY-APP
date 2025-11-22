"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const express_expeditious_1 = __importDefault(require("express-expeditious"));
const cacheoptions = {
    namespace: "expresscache",
    defaultTtl: 1000 * 60 * 10,
};
exports.cache = (0, express_expeditious_1.default)(cacheoptions);
//# sourceMappingURL=cache.js.map