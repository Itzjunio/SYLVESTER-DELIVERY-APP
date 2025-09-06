import  { model, Schema } from "mongoose";
import { Iaudit } from "../../types/index.js";




const auditSchema = new Schema<Iaudit>({
  userId: {type: Schema.Types.ObjectId},
  action: {type: String},
  ip: {type: String},
  userAgent: {type: String},
  createdAt: { type: Date, default: Date.now },
});


export  const AuditLog = model<Iaudit>("AuditLog", auditSchema);


export function logAction(userId: string, action: string, req: any) {
    AuditLog.create({
        userId,
        action,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
}