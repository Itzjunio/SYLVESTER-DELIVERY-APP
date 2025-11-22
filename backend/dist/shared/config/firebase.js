"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messaging = void 0;
const fs_1 = __importDefault(require("fs"));
// import path from "path";
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;
const serviceAccount = JSON.parse(fs_1.default.readFileSync(serviceAccountPath, "utf8"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
});
exports.messaging = firebase_admin_1.default.messaging();
//# sourceMappingURL=firebase.js.map