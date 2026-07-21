import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
  apiKey: "AIzaSyCt8QaI-MT9spA0yRSu519Y2oVliCdn1tE",
  authDomain: "sneakersmor-227e1.firebaseapp.com",
  projectId: "sneakersmor-227e1",
  storageBucket: "sneakersmor-227e1.firebasestorage.app",
  messagingSenderId: "593377346546",
  appId: "1:593377346546:web:3a8b640bd53ee605abe16b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const invRef = doc(db, "store", "inventory");
    const invSnap = await getDoc(invRef);
    if (invSnap.exists()) {
      const data = invSnap.data();
      console.log("Document keys count:", Object.keys(data).length);
      
      const tenKeys = Object.keys(data).slice(0, 10);
      console.log("Sample keys:", tenKeys);
      tenKeys.forEach(k => console.log(`${k}: ${data[k]}`));
      
      // Specifically check Niebla
      const nieblaKeys = Object.keys(data).filter(k => k.startsWith('9328196092205')); // ID of niebla
      console.log("Niebla keys count:", nieblaKeys.length);
      nieblaKeys.forEach(k => console.log(`${k}: ${data[k]}`));
    } else {
      console.log("Document does not exist");
    }
  } catch (e) {
    console.error("Firebase error:", e);
  }
}
test();
