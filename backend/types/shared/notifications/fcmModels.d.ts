import mongoose, { Document } from "mongoose";
import { IDeviceToken } from "./fcmSchemas";
export interface IDeviceTokenDoc extends IDeviceToken, Document {
}
export declare const DeviceToken: mongoose.Model<IDeviceTokenDoc, {}, {}, {}, mongoose.Document<unknown, {}, IDeviceTokenDoc, {}, {}> & IDeviceTokenDoc & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=fcmModels.d.ts.map