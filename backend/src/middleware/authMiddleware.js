const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

async function authMiddleware(req, res, next) {
    const authorization = req.get('Authorization');
    const match = typeof authorization === 'string'
        ? authorization.match(/^Bearer\s+(\S+)$/i)
        : null;

    if (!match) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not configured.');
        return res.status(500).json({ message: 'Unable to authenticate at this time.' });
    }

    let decoded;
    try {
        decoded = jwt.verify(match[1], process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    const userId = decoded && typeof decoded === 'object' ? decoded.userId : null;
    if (!userId) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    try {
        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        req.user = user;
        return next();
    } catch (error) {
        console.error('Authentication lookup failed:', error);
        return res.status(500).json({ message: 'Unable to authenticate at this time.' });
    }
}

module.exports = authMiddleware;
