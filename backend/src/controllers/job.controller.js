const jobModel = require('../models/job.model');

async function getJobs(req, res) {
    try {
        const jobs = await jobModel.find().sort({ createdAt: -1 });
        return res.status(200).json({ jobs });
    } catch (error) {
        console.error('Unable to get jobs:', error);
        return res.status(500).json({ message: 'Unable to retrieve jobs.' });
    }
}

async function getJobById(req, res) {
    try {
        const job = await jobModel.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        return res.status(200).json({ job });
    } catch (error) {
        if (error && error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid job ID.' });
        }

        console.error('Unable to get job:', error);
        return res.status(500).json({ message: 'Unable to retrieve job.' });
    }
}

async function createJob(req, res) {
    const body = req.body || {};
    const jobFields = [
        'title',
        'company',
        'location',
        'employmentType',
        'salary',
        'experience',
        'description',
        'skills',
        'source',
        'jobUrl',
        'postedAt',
    ];
    const jobData = {};

    for (const field of jobFields) {
        if (body[field] !== undefined) {
            jobData[field] = body[field];
        }
    }

    try {
        const job = await jobModel.create(jobData);
        return res.status(201).json({
            message: 'Job created successfully.',
            job,
        });
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).json({ message: 'A job with this URL already exists.' });
        }

        if (error && (error.name === 'ValidationError' || error.name === 'CastError')) {
            return res.status(400).json({ message: 'Invalid job data.' });
        }

        console.error('Unable to create job:', error);
        return res.status(500).json({ message: 'Unable to create job.' });
    }
}

async function deleteJob(req, res) {
    try {
        const job = await jobModel.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        return res.status(200).json({ message: 'Job deleted successfully.' });
    } catch (error) {
        if (error && error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid job ID.' });
        }

        console.error('Unable to delete job:', error);
        return res.status(500).json({ message: 'Unable to delete job.' });
    }
}

module.exports={
    getJobs,
    getJobById,
    createJob,
    deleteJob
}