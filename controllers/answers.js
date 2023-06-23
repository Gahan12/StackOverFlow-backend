const mongoose = require('mongoose');
const questions = require('../models/question.js');

module.exports.answers = async (req, res) => {
    const { id: _id } = req.params;
    const { noOfAns, answerBody, userAnswered, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('question unavailable...');
    }

    updateNoOfQuestions(_id, noOfAns);

    try {
        const updateAnswer = await questions.findByIdAndUpdate(_id, { $addToSet: { 'answer': [{ answerBody, userAnswered, userId }] } });
        res.status(200).json(updateAnswer);
    }
    catch (err) {
        res.status(409).json(err);
    }
}

const updateNoOfQuestions = async (_id, noOfAns) => {
    try {
        await questions.findByIdAndUpdate(_id, { $set: { 'noOfAns': noOfAns } });
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.deleteAnswer = async (req, res) => {
    const { id: _id } = req.params;
    const { answerId, noOfAns } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('question unavailable...'); 
    }

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
        return res.status(404).send('answer unavailable...'); 
    }

    updateNoOfQuestions(_id, noOfAns);

    try {
        await questions.updateOne(
            { _id },
            { $pull: { 'answer': { _id: answerId } } }
        )
        res.status(200).json({ message: 'Successfully deleted' });
    }
    catch (err) {
        res.status(409).json(err);
    }
}