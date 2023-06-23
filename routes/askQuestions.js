const express = require('express');
const { questions, getAllQuestions, deleteQuestion, votes } = require('../controllers/questions.js');
const auth = require('../middlewares/auth.js');

const router = express.Router();

router.post('/Ask', questions);
router.get('/get', getAllQuestions);
router.delete('/delete/:id', deleteQuestion);
router.patch('/vote/:id', votes);

module.exports = router;