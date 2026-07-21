const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

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

async function run() {
  console.log("Resetting inventory to {}...");
  const invRef = doc(db, "store", "inventory");
  await setDoc(invRef, {});
  console.log("Done! Inventory is now fully available.");
  process.exit(0);
}

run();
