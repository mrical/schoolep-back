const express = require('express');

const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const { stripe } = require('@/stripe');

const cookieParser = require('cookie-parser');
require('dotenv').config({ path: '.variables.env' });

const helpers = require('./helpers');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const chatApiRouter = require('./routes/coreRoutes/chatApi');

const { isValidAdminToken } = require('./controllers/coreControllers/authJwtController');

const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/erpRoutes/erpApi');
const { default: rateLimit } = require('express-rate-limit');
const { admin, db } = require('./firebaseDB');

// create our Express app
const app = express();
const corsOptions = {
  origin: true,
  credentials: true,
};
// Define the rate limit options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // 100 requests per windowMs per IP
});

// setting cors at one place for all the routes
// putting cors as first in order to avoid unneccessary requests from unallowed origins
app.use(function (req, res, next) {
  if (req.url.includes('/api')) {
    cors(corsOptions)(req, res, next);
  } else {
    cors()(req, res, next);
  }
});

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
// Takes the raw requests and turns them into usable properties on req.body
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  switch (event.type) {
    case 'payment_intent.created':
      const invoicePaymentCreated = event.data.object;
      console.log(invoicePaymentCreated);
      // Then define and call a function to handle the event invoice.payment_succeeded
      break;
    case 'invoice.payment_succeeded':
      const invoicePaymentSucceeded = event.data.object;
      console.log(invoicePaymentSucceeded);
    case 'customer.subscription.created':
      const customerSubscriptionCreated = event.data.object;
      console.log(customerSubscriptionCreated.customer);
      try {
        const docsSnapshot = await db
          .collection('users')
          .where('stripeId', '==', customerSubscriptionCreated.customer)
          .get();
        const userSnap = docsSnapshot.docs[0];
        await db.doc(`users/${userSnap.id}`).update({
          userChatRequestCount: parseInt(process.env.USER_FREE_REQUEST_LIMIT),
        });
      } catch (error) {
        console.log(error);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
});
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Apply the rate limiter middleware to your API endpoints
app.use('/api', limiter);

// pass variables to our templates + all requests

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.admin = req.admin || null;
  res.locals.currentPath = req.path;
  next();
});

// Here our API Routes
app.use('/api', coreAuthRouter);
app.use('/api', chatApiRouter);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.use('/api', isValidAdminToken, coreApiRouter);
app.use('/api', isValidAdminToken, erpApiRouter);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
