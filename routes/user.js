const express = require('express');
const { signup, login } = require('../controllers/auth.js');
const { getAllUsers, updateProfile } = require('../controllers/users.js');
const auth = require('../middlewares/auth.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/getAllUsers', getAllUsers);
router.patch('/update/:id', updateProfile);

module.exports = router;