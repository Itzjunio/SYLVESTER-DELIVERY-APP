"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToTopic = exports.sendPushNotification = exports.saveDeviceToken = exports.unSubscribeToTopic = exports.subscribeToTopic = void 0;
const fcmModels_1 = require("./fcmModels");
const mongoose_1 = require("mongoose");
const firebase_1 = require("../config/firebase");
const subscribeToTopic = async (token, topic) => {
    try {
        await firebase_1.messaging.subscribeToTopic(token, topic);
        console.log(`Successfully subscribed token to topic: ${topic}`);
    }
    catch (error) {
        console.error("Error subscribing to topic:", error);
    }
};
exports.subscribeToTopic = subscribeToTopic;
const unSubscribeToTopic = async (token, topic) => {
    try {
        await firebase_1.messaging.unsubscribeFromTopic(token, topic);
        console.log(`Successfully unsubscribed token to topic: ${topic}`);
    }
    catch (error) {
        console.error("Error unsubscribing to topic:", error);
    }
};
exports.unSubscribeToTopic = unSubscribeToTopic;
const saveDeviceToken = async (userId, role, token, platform) => {
    try {
        const upsertedToken = await fcmModels_1.DeviceToken.findOneAndUpdate({ userId: new mongoose_1.Types.ObjectId(userId) }, { userId: new mongoose_1.Types.ObjectId(userId), role, token, platform }, { upsert: true, new: true, setDefaultsOnInsert: true });
        console.log(`Device token saved for user ID: ${userId}`);
        if (upsertedToken && upsertedToken.token) {
            await (0, exports.subscribeToTopic)(upsertedToken.token, upsertedToken.role);
        }
    }
    catch (error) {
        console.error("Error saving or subscribing device token:", error);
    }
};
exports.saveDeviceToken = saveDeviceToken;
const sendPushNotification = async (userId, notification, data) => {
    const chunkArray = (arr, size = 500) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size)
            chunks.push(arr.slice(i, i + size));
        return chunks;
    };
    const deviceDocs = await fcmModels_1.DeviceToken.find({
        userId: new mongoose_1.Types.ObjectId(userId),
    }).select("token -_id");
    const tokens = deviceDocs.map((t) => t.token).filter(Boolean);
    if (!tokens.length)
        return { sent: 0, removed: 0 };
    let removed = 0;
    let sent = 0;
    const chunks = chunkArray(tokens, 500);
    for (const chunk of chunks) {
        try {
            const response = await firebase_1.messaging.sendEachForMulticast({
                tokens: chunk,
                notification,
                data,
            });
            sent += response.successCount;
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    const errCode = resp.error?.code;
                    if (errCode === "messaging/registration-token-not-registered" ||
                        errCode === "messaging/invalid-registration-token") {
                        const tokenToRemove = chunk[idx];
                        if (tokenToRemove) {
                            fcmModels_1.DeviceToken.deleteOne({ token: tokenToRemove }).catch(() => { });
                            removed++;
                        }
                    }
                    else {
                        console.warn("FCM send error for token:", chunk[idx], resp.error);
                    }
                }
            });
        }
        catch (err) {
            console.error("sendMulticast failed:", err);
        }
    }
    return { sent, removed };
};
exports.sendPushNotification = sendPushNotification;
const sendToTopic = async (topic, notification, data) => {
    try {
        const message = {
            topic,
            notification,
            data,
        };
        const response = await firebase_1.messaging.send(message);
        console.log(`Successfully sent message to topic ${topic}:`, response);
    }
    catch (error) {
        console.error(`Error sending message to topic ${topic}:`, error);
        throw error;
    }
};
exports.sendToTopic = sendToTopic;
//# sourceMappingURL=fcmService.js.map