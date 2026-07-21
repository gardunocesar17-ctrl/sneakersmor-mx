const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc } = require("firebase/firestore");
require('dotenv').config({ path: '.env.local' });

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
  const invSnap = await getDoc(doc(db, "store", "inventory"));
  const purchased = invSnap.exists() ? invSnap.data() : {};
  console.log("Firebase value for Tenis Dunk Niebla Blanco Niebla size 22:");
  
  // Need to find the product ID from lib/data.ts
  const { productos } = require('./lib/data.ts');
  const localProduct = productos.find(p => p.slug === 'tenis-dunk-niebla-blanco-niebla');
  if (localProduct) {
    const key = `${localProduct.id}-22`;
    console.log(`Key ${key} ->`, purchased[key]);
  } else {
    console.log("Product not found in data.ts");
  }
  process.exit();
}
test();
