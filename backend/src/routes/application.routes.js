const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication
} = require('../controllers/applicationController');

router.use(authMiddleware);

router.get('/getApplications', getApplications);
router.post('/createApplication', createApplication);
router.put('/update/:id', updateApplication);
router.delete('/delete/:id', deleteApplication);

module.exports = router;