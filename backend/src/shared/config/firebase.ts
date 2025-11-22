import fs from "fs";
// import path from "path";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();


const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT!;
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const messaging: admin.messaging.Messaging = admin.messaging();




