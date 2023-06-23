const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/auth.js");

module.exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, "test", {
      expiresIn: "1h",
    });
    res.status(200).json({ result: newUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong..." });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const isCorrectPassword = await bcrypt.compare(password, existingUser.password);
    if (!isCorrectPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, "test", {
      expiresIn: "1h",
    });
    res.status(200).json({ result: existingUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong..." });
  }
};
