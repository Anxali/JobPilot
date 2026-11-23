const express = require('express');

const {
    register,
    login,
    getCurrentUser,
    logout,
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current', getCurrentUser);
router.post('/logout', logout);

module.exports = router;