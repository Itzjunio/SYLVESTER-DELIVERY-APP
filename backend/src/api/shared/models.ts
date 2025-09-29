import mongoose, { Schema } from "mongoose";
import { IOrder, IRestaurant, IPayOut, IDisputes } from "../../types/";


const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
    cuisine: { type: [String], default: [], index: true},
    address: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const OrderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    riderId: { type: Schema.Types.ObjectId, ref: "User" },
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
    assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    rating: { type: Number},
    comment: { type: String },
    scheduledFor: { type: Date },
    deliveryAddress: { type: String, required: true },
    rejectionReason: { type: String },
    pickedUpAt: { type: Date, index: true},
    deliveredAt: { type: Date, index: true},
  },
  { timestamps: true }
);

const PayOutSchema = new Schema<IPayOut>({
  targetId: { type: Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["mtn", "vodafone", "airtel", "card"] },
  status: {
    type: String,
    enum: ["pending", "processed", "failed"],
    default: "pending", index: true
  },
  processedBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date },
});

const DisputeSchema = new Schema<IDisputes>({
  issue: { type: String },
  status: { type: String, enum: ["resolved", "pending"], default: "pending" },
  resolutionNotes: { type: String },
  createdAt: { type: Date },
});

export const RestaurantModel = mongoose.model<IRestaurant>(
  "Restaurant",
  RestaurantSchema
);
export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
export const PayOutModel = mongoose.model<IPayOut>("PayOut", PayOutSchema);
export const DisputeModel = mongoose.model<IDisputes>("Dispute", DisputeSchema);
