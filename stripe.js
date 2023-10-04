// import environmental variables from our variables.env file
require('dotenv').config({ path: '.variables.env' });

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = { stripe };
