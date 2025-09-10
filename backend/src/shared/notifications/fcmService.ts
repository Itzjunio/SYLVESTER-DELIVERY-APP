import { DeviceToken } from "./fcmModels";
import { Types } from "mongoose";
import { INotificationPayload, FcmMessage, FcmMessageTopic } from "./fcmSchemas";
import { messaging } from '../config/firebase';


export const subscribeToTopic = async (token: string, topic: string): Promise<void> => {
  try {
    await messaging.subscribeToTopic(token, topic);
    console.log(`Successfully subscribed token to topic: ${topic}`);
  } catch (error) {
    console.error('Error subscribing to topic:', error);
  }
};

export const unSubscribeToTopic = async (token: string, topic: string): Promise<void> => {
  try {
    await messaging.unsubscribeFromTopic(token, topic);
    console.log(`Successfully unsubscribed token to topic: ${topic}`);
  } catch (error) {
    console.error('Error unsubscribing to topic:', error);
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
): Promise<void> => {
  try {
    const deviceTokenDoc = await DeviceToken.findOne({ userId: new Types.ObjectId(userId) });
    if (!deviceTokenDoc) {
      console.log(`No device token found for user ID: ${userId}. Notification not sent.`);
      return;
    }

    const message: FcmMessage = {
        token: deviceTokenDoc.token,
        notification,
        data,
    };


    const response = await messaging.send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
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
      data
    };
    const response = await messaging.send(message);
    console.log(`Successfully sent message to topic ${topic}:`, response);
  } catch (error) {
    console.error(`Error sending message to topic ${topic}:`, error);
    throw error;
  }
};
