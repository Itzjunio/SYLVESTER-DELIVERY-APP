import mongoose, { Schema, Document } from "mongoose";
import { IDeviceToken } from "./fcmSchemas";


export interface IDeviceTokenDoc extends IDeviceToken, Document {}

const deviceTokenSchema = new Schema<IDeviceTokenDoc>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  platform: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const DeviceToken = mongoose.model<IDeviceTokenDoc>("DeviceToken", deviceTokenSchema);
