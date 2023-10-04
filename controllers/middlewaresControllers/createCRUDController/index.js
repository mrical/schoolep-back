const { admin } = require('@/firebaseDB');
const { stripe } = require('@/stripe');

const createCRUDController = (modelName) => {
  let crudMethods = {};

  crudMethods.create = async (req, res) => {
    if (modelName === 'Package') {
      try {
        const { name, prices, features, highlighted, requestLimit } = req.body;
        let metadata = {
          requestLimit: parseInt(process.env.USER_FREE_REQUEST_LIMIT) + requestLimit,
        };
        if (highlighted) {
          metadata = { ...metadata, highlighted };
        }
        const product = await stripe.products.create({
          name,
          features,
          metadata,
        });
        await stripe.products.update(product.id, { metadata: { firebaseRole: product.id } });
        const pricesData = await Promise.all(
          prices.map(async ({ amount, interval, currency }) => {
            const nonZeroDecimalCurrencyAmount = amount * 100;
            const price = await stripe.prices.create({
              unit_amount: nonZeroDecimalCurrencyAmount,
              currency,
              recurring: { interval },
              product: product.id,
            });
            return {
              id: price.id,
              interval: price.recurring.interval,
              currency: price.currency,
            };
          })
        );
        return res.status(200).json({
          success: true,
          result: {
            id: product.id,
            name: product.name,
            description: product.description,
            prices: pricesData,
          },
          message: 'Successfully Created the document in Model ',
        });
      } catch (error) {
        console.log(error);
        if (err.name == 'ValidationError') {
          return res.status(400).json({
            success: false,
            result: null,
            message: 'Required fields are not supplied',
            error: err,
          });
        } else {
          // Server Error
          return res.status(500).json({
            success: false,
            result: null,
            message: 'Oops there is an Error',
            error: err,
          });
        }
      }
    }
  };
  crudMethods.read = async (req, res) => {
    if (modelName === 'Invoice') {
      const id = req.params.id;
      const result = await stripe.invoices.retrieve(id);
      console.log(result.lines.data);
      console.log(result);
      // If no results found, return document not found
      if (!result) {
        return res.status(404).json({
          success: false,
          result: null,
          message: 'No document found by this id: ' + req.params.id,
        });
      } else {
        // Return success resposne
        return res.status(200).json({
          success: true,
          result: {
            id: result.id,
            number: result.number,
            year: result.year,
            status: result.status,
            invoice_pdf: result.invoice_pdf,
            subtotal: result.subtotal / 100,
            total: result.total / 100,
            amount_due: result.amount_due / 100,
            customer_name: result.customer_name,
            customer_address: result.customer_address,
            customer_email: result.customer_email,
            customer_phone: result.customer_phone,
            default_tax_rates: result.default_tax_rates,
            lines: {
              data: result.lines.data.map((item) => ({
                id: item.id,
                description: item.description,
                price: { unit_amount: item.price.unit_amount / 100 },
                amount: item.amount / 100,
              })),
            },
          },
          message: 'we found this document by this id: ' + req.params.id,
        });
      }
    }
    if (modelName === 'Package') {
    }
  };
  crudMethods.update = async (req, res) => {
    const id = req.params.id;
    if (modelName === 'Client') {
      try {
        console.log(req.body);

        await admin.firestore().doc(`users/${id}`).update(req.body);
        const result = await admin
          .firestore()
          .doc(`users/${id}`)
          .get((snap) => snap.data());
        if (!result) {
          return res.status(404).json({
            success: false,
            result: null,
            message: 'No document found by this id: ' + req.params.id,
          });
        } else {
          return res.status(200).json({
            success: true,
            result,
            message: 'we update this document by this id: ' + req.params.id,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (modelName === 'Package') {
      try {
        const id = req.params.id;
        const { name, description, prices } = req.body;
        const product = await stripe.products.update(id, {
          name,
          description,
        });
        const pricesData = await Promise.all(
          prices.map(async ({ amount, interval, currency, id }) => {
            // console.log(amount, interval, currency, id);
            const nonZeroDecimalCurrencyAmount = amount * 100;
            if (id) {
              const price = await stripe.prices.update(id, {
                unit_amount: nonZeroDecimalCurrencyAmount,
                currency,
                recurring: { interval },
                product: product.id,
              });
              return {
                id: price.id,
                interval: price.recurring.interval,
                currency: price.currency,
              };
            } else {
              const price = await stripe.prices.create({
                unit_amount: amount,
                currency,
                recurring: { interval },
                product: product.id,
              });
              return {
                id: price.id,
                interval: price.recurring.interval,
                currency: price.currency,
              };
            }
          })
        );
        return res.status(200).json({
          success: true,
          result: {
            id: product.id,
            name: product.name,
            description: product.description,
            prices: pricesData,
          },
          message: 'Successfully Created the document in Model ',
        });
      } catch (error) {
        console.log(error);
        if (err.name == 'ValidationError') {
          return res.status(400).json({
            success: false,
            result: null,
            message: 'Required fields are not supplied',
            error: err,
          });
        } else {
          // Server Error
          return res.status(500).json({
            success: false,
            result: null,
            message: 'Oops there is an Error',
            error: err,
          });
        }
      }
    }
  };
  crudMethods.delete = async (req, res) => {
    if (modelName === 'Package') {
      try {
        const id = req.params.id;
        const deleted = await stripe.products.update(id, { active: false });
        if (!deleted) {
          return res.status(404).json({
            success: false,
            result: null,
            message: 'No document found by this id: ' + req.params.id,
          });
        } else {
          return res.status(200).json({
            success: true,
            result: deleted,
            message: 'Successfully Deleted the document by id: ' + req.params.id,
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          result: null,
          message: 'Oops there is an Error',
          error: err,
        });
      }
    }
  };
  crudMethods.list = async (req, res) => {
    if (modelName === 'Client') {
      try {
        const limit = 10;
        const page = req.query.page || 1;

        // Page number (starting from 1)

        // Calculate the starting key for the current page
        let startKey = null;

        if (page > 1) {
          // To get the starting key for page N, fetch the last item from page N-1
          const previousPageLastItemRef = admin
            .firestore()
            .collection('users')
            .orderByKey()
            .limitToFirst(limit * (pageNumber - 1))
            .once('value')
            .then((snapshot) => {
              const data = snapshot.data();
              if (data) {
                const keys = Object.keys(data);
                startKey = keys[keys.length - 1];
              }
            })
            .catch((error) => {
              console.error('Error fetching last item:', error);
            });
        }
        const query = startKey
          ? admin
              .firestore()
              .collection('users')
              .startAfter(startKey || '')
          : admin.firestore().collection('users');
        const users = await query
          .limit(limit)
          .get()
          .then(async (docSnapshot) => {
            const users = [];
            await Promise.all(
              docSnapshot.docs.map(async (childSnapshot) => {
                const subsDocs = await admin
                  .firestore()
                  .collection(`users/${childSnapshot.id}/subscriptions`)
                  .where('status', 'in', ['trialing', 'active'])
                  .get();
                const subDoc = subsDocs.docs[0];
                if (subDoc) {
                  users.push({
                    ...childSnapshot.data(),
                    packageType: subDoc.data().items[0].price.product.name,
                    expiryDate: subDoc.data().current_period_end.toDate().toDateString(),
                  });
                } else {
                  users.push({
                    ...childSnapshot.data(),
                    packageType: 'Free',
                    expiryDate: 'None',
                  });
                }
              })
            );
            return users;
          });
        console.log(users);
        const count = users.length;
        const pages = Math.ceil(count / limit);

        const pagination = { page, pages, count };
        return res.status(200).json({
          success: true,
          result: users,
          pagination,
          message: 'Successfully found all documents',
        });
      } catch (error) {
        console.log(error);
      }
    } else if (modelName === 'Package') {
      try {
        const limit = 10;
        const page = req.query.page || 1;
        const { data: allData } = await stripe.products.list({ active: true, limit: limit * page });
        const data = allData.splice(limit * (page - 1));
        const products = await Promise.all(
          data.map(async (p) => {
            const { data: prices } = await stripe.prices.list({ active: true, product: p.id });
            console.log(prices);
            const filteredPrices = prices.map((p) => ({
              id: p.id,
              interval: p.recurring ? p.recurring.interval : 'onetime',
              amount: p.unit_amount / 100,
              currency: p.currency,
            }));
            return {
              id: p.id,
              prices: filteredPrices,
              name: p.name,
              description: p.description,
              highlighted: p.metadata.highlighted ? 'true' : 'false',
              features: p.features,
            };
          })
        );

        const count = products.length;
        const pages = Math.ceil(count / limit);

        const pagination = { page, pages, count };
        console.log(data);

        console.log(products);
        console.log(pagination);
        if (products.length > 0) {
          return res.status(200).json({
            success: true,
            result: products,
            pagination,
            message: 'Successfully found all documents',
          });
        } else {
          return res.status(203).json({
            success: true,
            result: [],
            pagination,
            message: 'Collection is Empty',
          });
        }
      } catch (error) {
        console.log('err', error);
        return res.status(500).json({
          success: false,
          result: [],
          message: 'Oops there is an Error',
          error: err,
        });
      }
    } else if (modelName === 'Invoice') {
      const limit = 10;
      const page = req.query.page || 1;
      const { data } = await stripe.invoices.list({ limit: limit * page });
      const result = data.splice(limit * (page - 1));
      const count = result.length;
      const pages = Math.ceil(count / limit);
      const pagination = { page, pages, count };
      if (result.length > 0) {
        return res.status(200).json({
          success: true,
          result: result.map((invoice) => ({
            ...invoice,
            subtotal: invoice.subtotal / 100,
            total: invoice.total / 100,
            amount_due: invoice.amount_due / 100,
          })),
          pagination,
          message: 'Successfully found all documents',
        });
      } else {
        return res.status(203).json({
          success: true,
          result: [],
          pagination,
          message: 'Collection is Empty',
        });
      }
    }
  };

  return crudMethods;
};

module.exports = createCRUDController;
