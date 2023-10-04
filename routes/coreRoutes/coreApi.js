const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');

const router = express.Router();

const adminController = require('@/controllers/coreControllers/adminController');
// //_______________________________ Admin management_______________________________
router.route('/admin/read/:id').get(catchErrors(adminController.read));
router.route('/admin/profile').get(catchErrors(adminController.profile));



module.exports = router;
