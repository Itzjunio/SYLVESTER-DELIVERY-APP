// import fs from "fs";
import path from "path";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();


const serviceAccountPath =
  path.join(__dirname, "../../../../food-delivery-485f7-firebase-adminsdk-fbsvc-9251cfded5.json");


// const serviceAccount = JSON.parse(
//   fs.readFileSync(serviceAccountPath, "utf8")
// );

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

export const messaging: admin.messaging.Messaging = admin.messaging();
