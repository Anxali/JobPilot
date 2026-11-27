const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    getJobs,
    getJobById,
    createJob,
    deleteJob
} = require('../controllers/jobController');

router.get('/getAllJobs', getJobs);
router.get('/get/:id', getJobById);
router.post('/createJob', authMiddleware, createJob);
router.delete('/delete/:id', authMiddleware, deleteJob);

module.exports = router;