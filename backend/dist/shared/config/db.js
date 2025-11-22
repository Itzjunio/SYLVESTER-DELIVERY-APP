"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getMongoDbUri = () => {
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI must be defined in environment variables");
    }
    return {
        mongoDbUri: MONGODB_URI,
    };
};
const mongoUri = getMongoDbUri();
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(mongoUri.mongoDbUri);
        console.log("MongoDB connected successfully via Mongoose!");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map