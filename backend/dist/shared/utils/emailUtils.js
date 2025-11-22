"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEmailSecrets = () => {
    const { EMAIL_USER, EMAIL_PASS } = process.env;
    if (!EMAIL_USER || !EMAIL_PASS) {
        throw new Error("EMAIL_USER and EMAIL_PASS must be defined in environment variables");
    }
    return {
        emailUser: EMAIL_USER,
        emailPass: EMAIL_PASS,
    };
};
const emailSecrets = getEmailSecrets();
const transport = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: emailSecrets.emailUser,
        pass: emailSecrets.emailPass,
    },
});
async function sendMail(to, subject, html) {
    return transport.sendMail({
        from: `"App" <${emailSecrets.emailUser}>`,
        to,
        subject,
        html,
    });
}
//# sourceMappingURL=emailUtils.js.map