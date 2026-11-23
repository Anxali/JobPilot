const express = require('express');
const router = express.Router();

const {
    getJobs,
    getJobById,
    createJob,
    deleteJob
} = require('../controllers/jobController');

router.get('/getAllJobs', getJobs);
router.get('/get/:id', getJobById);
router.post('/createJob', createJob);
router.delete('/delete/:id', deleteJob);

module.exports = router;