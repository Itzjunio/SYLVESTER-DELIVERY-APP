import { Iaudit } from "../../types/index";
import { Schema, model } from "mongoose";

const auditSchema = new Schema<Iaudit>({
  userId: { type: Schema.Types.ObjectId },
  action: { type: String },
  ip: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const AuditLog = model<Iaudit>("AuditLog", auditSchema);
