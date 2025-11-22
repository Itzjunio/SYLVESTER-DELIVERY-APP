import { INotificationPayload } from "./fcmSchemas";
export declare const subscribeToTopic: (token: string, topic: string) => Promise<void>;
export declare const unSubscribeToTopic: (token: string, topic: string) => Promise<void>;
export declare const saveDeviceToken: (userId: string, role: string, token: string, platform: "web" | "ios" | "android") => Promise<void>;
export declare const sendPushNotification: (userId: string, notification: INotificationPayload, data: {
    [key: string]: string;
}) => Promise<{
    sent: number;
    removed: number;
}>;
export declare const sendToTopic: (topic: string, notification: INotificationPayload, data: {
    [key: string]: string;
}) => Promise<void>;
//# sourceMappingURL=fcmService.d.ts.map