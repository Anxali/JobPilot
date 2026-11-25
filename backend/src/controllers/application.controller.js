const applicationModel = require('../models/application.model');

async function getApplications(req, res) {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const applications = await applicationModel
            .find({ user: userId })
            .populate('job')
            .sort({ createdAt: -1 });

        return res.status(200).json({ applications });
    } catch (error) {
        console.error('Unable to get applications:', error);
        return res.status(500).json({ message: 'Unable to retrieve applications.' });
    }
}

async function createApplication(req, res) {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const { job, status, appliedAt, notes, followUpDate } = req.body || {};
    if (typeof job !== 'string' || !job.trim()) {
        return res.status(400).json({ message: 'A job ID is required.' });
    }

    try {
        const application = await applicationModel.create({
            user: userId,
            job: job.trim(),
            status,
            appliedAt,
            notes,
            followUpDate,
        });

        return res.status(201).json({
            message: 'Application created successfully.',
            application,
        });
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).json({ message: 'An application for this job already exists.' });
        }

        if (error && (error.name === 'ValidationError' || error.name === 'CastError')) {
            return res.status(400).json({ message: 'Invalid application data.' });
        }

        console.error('Unable to create application:', error);
        return res.status(500).json({ message: 'Unable to create application.' });
    }
}

async function updateApplication(req, res) {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const body = req.body || {};
    const updates = {};
    for (const field of ['status', 'appliedAt', 'notes', 'followUpDate']) {
        if (body[field] !== undefined) {
            updates[field] = body[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'At least one application field must be provided.' });
    }

    try {
        const application = await applicationModel.findOneAndUpdate(
            { _id: req.params.id, user: userId },
            updates,
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        return res.status(200).json({
            message: 'Application updated successfully.',
            application,
        });
    } catch (error) {
        if (error && (error.name === 'ValidationError' || error.name === 'CastError')) {
            return res.status(400).json({ message: 'Invalid application data.' });
        }

        console.error('Unable to update application:', error);
        return res.status(500).json({ message: 'Unable to update application.' });
    }
}

async function deleteApplication(req, res) {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const application = await applicationModel.findOneAndDelete({
            _id: req.params.id,
            user: userId,
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        return res.status(200).json({ message: 'Application deleted successfully.' });
    } catch (error) {
        if (error && error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid application ID.' });
        }

        console.error('Unable to delete application:', error);
        return res.status(500).json({ message: 'Unable to delete application.' });
    }
}

module.exports = {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication
}