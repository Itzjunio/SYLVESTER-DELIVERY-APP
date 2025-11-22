import { Types } from "mongoose";
import { z } from "zod";
export declare const IDeviceTokenValidate: z.ZodObject<{
    userId: z.ZodString;
    token: z.ZodString;
    platform: z.ZodEnum<{
        web: "web";
        ios: "ios";
        android: "android";
    }>;
    role: z.ZodEnum<{
        customer: "customer";
        vendor: "vendor";
        rider: "rider";
    }>;
    createdAt: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodDate]>, z.ZodTransform<Date, string | Date>>;
}, z.core.$strip>;
type IDeviceToken = Omit<z.infer<typeof IDeviceTokenValidate>, "userId"> & {
    userId: Types.ObjectId;
};
interface INotificationPayload {
    title: string;
    body: string;
    imgUrl?: string;
}
interface FcmMessageTopic {
    topic: string;
    notification: INotificationPayload;
    data?: {
        [key: string]: string;
    };
}
export type { INotificationPayload, FcmMessageTopic, IDeviceToken };
//# sourceMappingURL=fcmSchemas.d.ts.map