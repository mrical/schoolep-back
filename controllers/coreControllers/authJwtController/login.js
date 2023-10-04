const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { stubFalse } = require('lodash');
const { db, admin } = require('../../../firebaseDB');
const serviceAccount = require('../../../serviceAccountKey.json');
// const firebase=require('firebase')

require('dotenv').config({ path: '.variables.env' });

const login = async (req, res) => {
  try {
    const clientIP = req.connection.remoteAddress;
    let isLocalhost = false;
    if (clientIP === '127.0.0.1' || clientIP === '::1') {
      isLocalhost = true;
    }

    try {
      // Sign in the user with email and password
      const user = await admin
        .auth()
        .verifyIdToken(req.headers.authorization)
        .then(async (user) => {
          const userRef = db.doc('users/' + user.user_id);
          const userSnapshot = await userRef.get();
          return userSnapshot.data();
        });
      // Check if the user is an admin (you may have custom logic for this)
      if (user.admin) {
        // Generate a custom token for the user
        const encoded = jwt.sign({ userId: user.id, admin: true }, serviceAccount.private_key, {
          algorithm: 'RS256',
          expiresIn: '2 days',
        });
        return res
          .status(200)
          .cookie('token', encoded, {
            maxAge: req.body.remember ? 365 * 24 * 60 * 60 * 1000 : null, // Cookie expires after 30 days
            sameSite: process.env.NODE_ENV === 'production' && !isLocalhost ? 'Lax' : 'none',
            httpOnly: true,
            secure: true,
            domain: req.hostname,
            Path: '/',
          })
          .json({
            success: true,
            message: 'Successfully  admin',
          });
      } else {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'User is not an admin',
        });
      }
    } catch (error) {
      // throw error;
      console.log(error);
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid/Missing credentials.',
      });
    }
  } catch (err) {
    console.log('error', err);
    res.status(500).json({ success: false, result: req.body, message: err.message, error: err });
  }
};

module.exports = login;
