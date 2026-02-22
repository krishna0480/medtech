// // Import the functions you need from the SDKs you need
// import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics, isSupported } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCMu9CvIQK5YGWFOgopLlUwoNwvXQV-f94",
//   authDomain: "med-tech-85577.firebaseapp.com",
//   projectId: "med-tech-85577",
//   storageBucket: "med-tech-85577.firebasestorage.app",
//   messagingSenderId: "276854439285",
//   appId: "1:276854439285:web:a1e03a718b573e8ce8e73c",
//   measurementId: "G-C2V6Z26CTJ"
// };

// // 1. Initialize Firebase App (Server & Client compatible)
// const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// // 2. Initialize Auth (Server & Client compatible)
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

// let analytics;
// if (typeof window !== "undefined") {
//   isSupported().then((supported) => {
//     if (supported) {
//       analytics = getAnalytics(app);
//     }
//   });
// }


// export { app, auth, analytics, db, storage };