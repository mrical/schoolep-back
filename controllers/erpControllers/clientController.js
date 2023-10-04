const moment = require('moment');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { admin } = require('@/firebaseDB');
const { stripe } = require('@/stripe');
const methods = createCRUDController('Client');

methods.summary = async (req, res) => {
  try {
    const activeSubscriptions = await stripe.subscriptions.list({ status: 'active' });
    const numberOfSubscribedCustomers = activeSubscriptions.data.length;

    const canceledSubscriptions = await stripe.subscriptions.list({ status: 'canceled' });
    const numberOfCanceledCustomerSubscription = canceledSubscriptions.data.length;

    const endedSubscriptions = await stripe.subscriptions.list({ status: 'canceled' });
    const numberOfEndedCustomerSubscription = endedSubscriptions.data.length;

    const totalCustomers = await stripe.customers.list();
    const numberOfCustomers = totalCustomers.data.length;

    const { data: plansList } = await stripe.products.list({ active: true });
    await Promise.all(
      plansList.map(async (p) => {
        const { data: subs } = await stripe.subscriptions.list();
        const subsToPlan = subs.filter((sub) => sub.plan.product === p.id);
      })
    );

    let defaultType = 'month';
    const { type } = req.query;

    if (type && ['week', 'month', 'year'].includes(type)) {
      defaultType = type;
    } else if (type) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid type',
      });
    }

    const currentDate = moment();
    let startDate = currentDate.clone().startOf(defaultType);
    let endDate = currentDate.clone().endOf(defaultType);
    const { users } = await admin.auth().listUsers();
    const usersCreatedThisMonth = users.filter((user) => {
      const userCreationDate = user.metadata.creationTime;
      const creationTime = new Date(userCreationDate);
      return creationTime >= startDate && creationTime <= endDate;
    });

    const totalClients = users.length;
    const totalNewClients = usersCreatedThisMonth.length;
    const activeClients = numberOfSubscribedCustomers;

    const totalActiveClientsPercentage =
      totalClients > 0 ? (activeClients / totalClients) * 100 : 0;
    const totalNewClientsPercentage = totalClients > 0 ? (totalNewClients / totalClients) * 100 : 0;

    return res.status(200).json({
      success: true,
      result: {
        new: Math.round(totalNewClientsPercentage),
        active: Math.round(totalActiveClientsPercentage),
        activeSubscriptions: numberOfSubscribedCustomers,
        canceledSubscriptions: numberOfCanceledCustomerSubscription,
        endedSubscriptions: numberOfEndedCustomerSubscription,
        numberOfCustomers,
      },
      message: 'Successfully get summary of new clients',
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      success: false,
      result: null,
      error: error.message, // Include a more descriptive error message
      message: 'Oops, there is an Error',
    });
  }
};

module.exports = methods;
