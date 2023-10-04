const moment = require('moment');
const { stripe } = require('@/stripe');


const summary = async (req, res) => {
  try {
    let defaultType = 'month';

    const { type } = req.query;

    if (type) {
      if (['week', 'month', 'year'].includes(type)) {
        defaultType = type;
      } else {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Invalid type',
        });
      }
    }

    const currentDate = moment();
    let startDate = currentDate.clone().startOf(defaultType);
    let endDate = currentDate.clone().endOf(defaultType);

    const statuses = ['draft', 'open', 'void', 'paid', 'uncollectible', 'overdue'];

    const { data: invoices } = await stripe.invoices.list({
      created: { gte: startDate.toDate(), lte: endDate.toDate() },
    });

    // Total Invoice Calculation
    const totalInvoice = invoices.reduce(
      (accumulator, invoice) => {
        accumulator.total += invoice.total / 100;
        accumulator.count += 1;
        return accumulator;
      },
      { total: 0, count: 0 }
    );

    // Status Counts Calculation
    const statusCounts = invoices.reduce((accumulator, invoice) => {
      const status = invoice.status;
      accumulator[status] = (accumulator[status] || 0) + 1;
      return accumulator;
    }, {});

    // Overdue Counts Calculation
    const overdueCounts = invoices.reduce((accumulator, invoice) => {
      const expiredDate = new Date(invoice.due_date);
      if (expiredDate < currentDate) {
        const status = invoice.status;
        accumulator[status] = (accumulator[status] || 0) + 1;
      }
      return accumulator;
    }, {});


    let result = [];

    const totalInvoices = totalInvoice;

    const statusResultMap = Object.keys(statusCounts).map((key) => {
      return {
        status: key,
        count: statusCounts[key],
        percentage: Math.round((statusCounts[key] / totalInvoices.count) * 100),
      };
    });

    const overdueResultMap = Object.keys(overdueCounts).map((key) => {
      return {
        count: overdueCounts[key],
        status: 'overdue',
        percentage: Math.round((overdueCounts[key] / totalInvoices.count) * 100),
      };
    });

    statuses.forEach((status) => {
      const found = [...statusResultMap, ...overdueResultMap].find(
        (item) => item.status === status
      );
      if (found) {
        result.push(found);
      }
    });

    const { data: unpaid } = await stripe.invoices.list({
      status: 'open',
      due_date: { lte: new Date() },
    });
    const unpaidInvoice = unpaid.reduce(
      (accumulator, invoice) => {
        accumulator.total += invoice.total / 100;
        accumulator.count += 1;
        return accumulator;
      },
      { total: 0, count: 0 }
    );

    const finalResult = {
      total: totalInvoices?.total.toFixed(2),
      total_undue: unpaidInvoice.total.toFixed(2),
      type,
      performance: result,
    };

    return res.status(200).json({
      success: true,
      result: finalResult,
      message: `Successfully found all invoices for the last ${defaultType}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
      error: error,
    });
  }
};

module.exports = summary;
