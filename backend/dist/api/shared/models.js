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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputeModel = exports.PayOutModel = exports.OrderModel = exports.RestaurantModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const RestaurantSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
            index: "2dsphere",
        },
    },
    menu: [
        {
            name: { type: String, required: true },
            description: { type: String },
            price: { type: Number, required: true },
            image: { type: String },
            category: { type: String },
            isAvailable: { type: Boolean, default: true },
        },
    ],
    cuisine: { type: [String], default: [], index: true },
    address: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    commissionRate: { type: Number, default: 10 },
}, { timestamps: true });
const OrderSchema = new mongoose_1.Schema({
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    riderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    items: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    orderStatus: {
        type: String,
        enum: ["pending", "accepted", "in-transit", "delivered", "cancelled"],
        default: "pending", index: true
    },
    assignedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    rating: { type: Number },
    comment: { type: String },
    scheduledFor: { type: Date },
    deliveryAddress: { type: String, required: true },
    rejectionReason: { type: String },
    pickedUpAt: { type: Date, index: true },
    deliveredAt: { type: Date, index: true },
}, { timestamps: true });
const PayOutSchema = new mongoose_1.Schema({
    targetId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["mtn", "vodafone", "airtel", "card"] },
    status: {
        type: String,
        enum: ["pending", "processed", "failed"],
        default: "pending", index: true
    },
    processedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date },
});
const DisputeSchema = new mongoose_1.Schema({
    issue: { type: String },
    status: { type: String, enum: ["resolved", "pending"], default: "pending" },
    resolutionNotes: { type: String },
    createdAt: { type: Date },
});
exports.RestaurantModel = mongoose_1.default.model("Restaurant", RestaurantSchema);
exports.OrderModel = mongoose_1.default.model("Order", OrderSchema);
exports.PayOutModel = mongoose_1.default.model("PayOut", PayOutSchema);
exports.DisputeModel = mongoose_1.default.model("Dispute", DisputeSchema);
//# sourceMappingURL=models.js.map