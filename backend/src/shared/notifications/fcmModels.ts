import mongoose, { Schema, Document, Types } from "mongoose";

type platformType = "web" | "ios" | "andriod";

export interface IDeviceToken extends Document {
  userId: Types.ObjectId;
  role: string;
  token: string;
  platform: platformType;
  createdAt: Date;
}

const deviceTokenSchema = new Schema<IDeviceToken>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  platform: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const DeviceToken = mongoose.model<IDeviceToken>("DeviceToken", deviceTokenSchema);
