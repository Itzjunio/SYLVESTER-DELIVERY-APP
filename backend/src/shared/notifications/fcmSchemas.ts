import { Types } from "mongoose";
import { z } from "zod";

export const IDeviceTokenValidate = z.object({
  userId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
  token: z.string(),
  platform: z.enum(["web", "ios", "android"]),
  role: z.enum(["customer", "vendor", "rider"]),
  createdAt: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val)),
});

type IDeviceToken = Omit<z.infer<typeof IDeviceTokenValidate>, "userId"> & {
  userId: Types.ObjectId;
};

interface INotificationPayload {
  title: string;
  body: string;
  imgUrl?: string;
}

// interface FcmMessage {
//   notification: INotificationPayload;
//   token: string;
//   data?: { [key: string]: string };
// }

interface FcmMessageTopic {
  topic: string;
  notification: INotificationPayload;
  data?: { [key: string]: string };
}

export type { INotificationPayload, FcmMessageTopic, IDeviceToken };
