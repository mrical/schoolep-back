const admin = require('firebase-admin');
require('dotenv').config({ path: '.variables.env' });
const serviceAccount = require('./serviceAccountKey.json'); // Replace with your service account key file

function initDB() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASEURL, // Replace with your Firebase project URL
  });
  return admin.firestore();
}
const db = initDB();
module.exports = { db, admin };
