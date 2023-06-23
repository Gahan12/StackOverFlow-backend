const User = require('../models/auth.js');
const mongoose = require('mongoose');

module.exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        let allUserDetail = [];
        allUsers.forEach((users => {
            allUserDetail.push({ _id: users._id, name: users.name, about: users.about, tags: users.tags, joinedOn: users.joinedOn });
        }))
        res.status(200).json(allUserDetail);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

module.exports.updateProfile = async (req, res) => {
    const { id: _id } = req.params;
    const { name, about, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("question unvailable...");
    }

    try {
        const newProfile = await User.findByIdAndUpdate(_id, { $set: { 'name': name, 'about': about, 'tags': tags } }, { new: true });
        res.status(200).json(newProfile);
    }
    catch (err) {
        res.status(405).json({ message: err.message });
    }
}