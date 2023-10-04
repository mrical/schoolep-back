const express = require('express');

const { catchErrors } = require('@/handlers/errorHandlers');

const router = express.Router();

const clientController = require('@/controllers/erpControllers/clientController');
const invoiceController = require('@/controllers/erpControllers/invoiceController');
const packageController = require('@/controllers/erpControllers/packageController');



// //_____________________________________ API for clients __________________________________________________
router.route('/client/list').get(catchErrors(clientController.list));
router.route('/client/summary').get(catchErrors(clientController.summary));

// //_________________________________________________________________API for invoices_____________________
router.route('/invoice/read/:id').get(catchErrors(invoiceController.read));
router.route('/invoice/list').get(catchErrors(invoiceController.list));
router.route('/invoice/summary').get(catchErrors(invoiceController.summary));

// //_________________________________________________________________API for Packages_____________________

router.route('/package/create').post(catchErrors(packageController.create));
router.route('/package/read/:id').get(catchErrors(packageController.read));
router.route('/package/update/:id').patch(catchErrors(packageController.update));
router.route('/package/delete/:id').delete(catchErrors(packageController.delete));
router.route('/package/list').get(catchErrors(packageController.list));

module.exports = router;
