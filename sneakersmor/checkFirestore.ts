import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  const invRef = doc(db, "store", "inventory");
  const invSnap = await getDoc(invRef);
  if (invSnap.exists()) {
    const data = invSnap.data();
    console.log("Total entries in inventory:", Object.keys(data).length);
    // Find all entries for Tenis 270 Negro Total (ID: 7086002208816)
    const negroTotalKeys = Object.keys(data).filter(k => k.startsWith("7086002208816"));
    console.log("Entries for Tenis 270 Negro Total:");
    for (const key of negroTotalKeys) {
      console.log(key, "=>", data[key]);
    }
  } else {
    console.log("Inventory doc does not exist!");
  }
}
test();
