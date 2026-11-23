const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        company: {
            type: String,
            required: true,
            trim: true,
        },
        location: String,
        employmentType: String,
        salary: String,
        experience: String,
        description: String,
        skills: {
            type: [String],
            default: [],
        },
        source: String,
        jobUrl: {
            type: String,
            required: true,
        },
        postedAt: Date,
    },
    { timestamps: true }
);

jobSchema.index({ jobUrl: 1 }, { unique: true });

module.exports = mongoose.model('Job', jobSchema);