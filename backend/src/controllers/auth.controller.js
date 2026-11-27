const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

async function registerUser(req, res) {
    const { name, email, password } = req.body || {};

    if (
        typeof name !== 'string' ||
        !name.trim() ||
        typeof email !== 'string' ||
        !email.trim() ||
        typeof password !== 'string' ||
        !password
    ) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        const existingUser = await userModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await userModel.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: 'Registration successful.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        console.error('Registration failed:', error);
        return res.status(500).json({ message: 'Unable to register at this time.' });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await userModel.findOne({ email: email.trim().toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured.');
            return res.status(500).json({ message: 'Unable to log in at this time.' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Login failed:', error);
        return res.status(500).json({ message: 'Unable to log in at this time.' });
    }
}

async function logoutUser(req, res) {
    return res.status(200).json({ message: 'Logout successful.' });
}

async function getCurrentUser(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    return res.status(200).json({
        user: {
            id: user._id || user.id,
            name: user.name,
            email: user.email,
        },
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
}