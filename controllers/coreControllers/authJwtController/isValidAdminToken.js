const jwt = require('jsonwebtoken');
const serviceAccount = require('../../../serviceAccountKey.json');
const { admin } = require('../../../firebaseDB');

require('dotenv').config({ path: '.variables.env' });

const isValidAdminToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'No authentication token, authorization denied.',
        jwtExpired: true,
      });
    let verified;
    jwt.verify(
      token,
      serviceAccount.private_key,
      { algorithms: ['RS256'] },
      function (err, decoded) {
        console.log('err', err);
        verified = decoded;
      }
    );

    if (!verified)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Token verification failed, authorization denied.',
        jwtExpired: true,
      });

    if (!verified.admin)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Admin doens't Exist, authorization denied.",
        jwtExpired: true,
      });

    req.admin = verified;
    next();
  } catch (err) {
    res.status(503).json({
      success: false,
      result: null,
      message: err.message,
      error: err,
    });
  }
};

module.exports = isValidAdminToken;
