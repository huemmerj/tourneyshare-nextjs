import * as admin from "firebase-admin";

console.log(
  "FIREBASE_SERVICE_ACCOUNT_KEY",
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY
);
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

const app = admin.app();
export default admin;
export { app };
