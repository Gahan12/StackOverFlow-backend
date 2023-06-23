const express = require('express');
const { answers, deleteAnswer } = require("../controllers/answers");
const auth = require('../middlewares/auth');

const router = express.Router();

router.patch('/post/:id', answers);
router.patch('/delete/:id', deleteAnswer);

module.exports = router;