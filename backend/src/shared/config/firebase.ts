import admin from "firebase-admin";
import dotenv from 'dotenv';
import path from "path";

dotenv.config();


const serviceAccountPath = path.resolve(__dirname, '../../../food-delivery-485f7-firebase-adminsdk-fbsvc-9251cfded5.json');
const serviceAccount = require(serviceAccountPath);


admin.initializeApp({credential: admin.credential.cert(serviceAccount),});

export const messaging: admin.messaging.Messaging = admin.messaging();
