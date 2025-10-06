import { DeviceToken } from "./fcmModels";
import { Types } from "mongoose";
import {
  INotificationPayload,
  FcmMessageTopic,
} from "./fcmSchemas";
import { messaging } from "../config/firebase";

export const subscribeToTopic = async (
  token: string,
  topic: string
): Promise<void> => {
  try {
    await messaging.subscribeToTopic(token, topic);
    console.log(`Successfully subscribed token to topic: ${topic}`);
  } catch (error) {
    console.error("Error subscribing to topic:", error);
  }
};

export const unSubscribeToTopic = async (
  token: string,
  topic: string
): Promise<void> => {
  try {
    await messaging.unsubscribeFromTopic(token, topic);
    console.log(`Successfully unsubscribed token to topic: ${topic}`);
  } catch (error) {
    console.error("Error unsubscribing to topic:", error);
  }
};

export const saveDeviceToken = async (
  userId: string,
  role: string,
  token: string,
  platform: "web" | "ios" | "android"
): Promise<void> => {
  try {
    const upsertedToken = await DeviceToken.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { userId: new Types.ObjectId(userId), role, token, platform },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`Device token saved for user ID: ${userId}`);

    if (upsertedToken && upsertedToken.token) {
      await subscribeToTopic(upsertedToken.token, upsertedToken.role);
    }
  } catch (error) {
    console.error("Error saving or subscribing device token:", error);
  }
};

export const sendPushNotification = async (
  userId: string,
  notification: INotificationPayload,
  data: { [key: string]: string }
): Promise<{ sent: number; removed: number }> => {
  const chunkArray = <T>(arr: T[], size = 500): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size)
      chunks.push(arr.slice(i, i + size));
    return chunks;
  };
  const deviceDocs = await DeviceToken.find({
    userId: new Types.ObjectId(userId),
  }).select("token -_id");
  const tokens = deviceDocs.map((t) => t.token).filter(Boolean);
  if (!tokens.length) return { sent: 0, removed: 0 };

  let removed = 0;
  let sent = 0;
  const chunks = chunkArray(tokens, 500);
  for (const chunk of chunks) {
    try {
      const response = await messaging.sendEachForMulticast({
        tokens: chunk,
        notification,
        data,
      });

      sent += response.successCount;
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errCode = (resp.error as any)?.code;
          if (
            errCode === "messaging/registration-token-not-registered" ||
            errCode === "messaging/invalid-registration-token"
          ) {
            const tokenToRemove = chunk[idx];
            if (tokenToRemove) {
              DeviceToken.deleteOne({ token: tokenToRemove }).catch(() => {});
              removed++;
            }
          } else {
            console.warn("FCM send error for token:", chunk[idx], resp.error);
          }
        }
      });
    } catch (err) {
      console.error("sendMulticast failed:", err);
    }
  }

  return { sent, removed };
};

export const sendToTopic = async (
  topic: string,
  notification: INotificationPayload,
  data: { [key: string]: string }
): Promise<void> => {
  try {
    const message: FcmMessageTopic = {
      topic,
      notification,
      data,
    };
    const response = await messaging.send(message);
    console.log(`Successfully sent message to topic ${topic}:`, response);
  } catch (error) {
    console.error(`Error sending message to topic ${topic}:`, error);
    throw error;
  }
};
