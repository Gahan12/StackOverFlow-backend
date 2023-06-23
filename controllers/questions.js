const mongoose  = require('mongoose');
const question = require('../models/question.js');

module.exports.questions = async (req, res) => {
    const postQuestionData = req.body;
    const postQuestion = new question({ ...postQuestionData });
    try {
        await postQuestion.save();
        res.status(200).json("Post a new question successfully");
    } catch (error) {
        console.log(error);
        res.status(409).json("Couldn't post a new question");
    }
}

module.exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await question.find();
        res.status(200).json(questions);
    }
    catch(e) {
        res.status(404).json({ message: e.message });
    }
}

module.exports.deleteQuestion = async (req, res) => {
    const { id: _id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('...question unavailable');
    }

    try {
        await question.findByIdAndRemove(_id);
        res.status(200).json({ message: "successfully deleted..." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports.votes = async (req, res) => {
    const { id: _id } = req.params;
    const { value, userId } = req.body;;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('...question unavailable');
    }

    try {
        const Question = await question.findById(_id);
        const upVote = Question.upVote.findIndex((id) => id === String(userId));
        const downVote = Question.downVote.findIndex((id) => id === String(userId));

        if (value === 'upVote') {
            if (downVote !== -1) {
                Question.downVote = Question.downVote.filter((id) => id !== String(userId));
            }
            if (upVote === -1) {
                Question.upVote.push(userId);
            }
            else {
                Question.upVote = Question.upVote.filter((id) => id !== String(userId));
            }
        }
        if (value === 'downVote') {
            if (upVote !== -1) {
                Question.upVote = Question.upVote.filter((id) => id !== String(userId));
            }
            if (downVote === -1) {
                Question.downVote.push(userId);
            }
            else {
                Question.downVote = Question.downVote.filter((id) => id !== String(userId));
            }
        }
        await question.findByIdAndUpdate(_id, Question);
        res.status(200).json({ message: "Voted successfully..." });
    }
    catch (err) {
        res.status(409).json({ message: "id not found" });
    }
}