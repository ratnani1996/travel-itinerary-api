const User = require("../model/user");
const { createJWTToken, verifyJWTToken } = require("../utility/jwtToken");
const { isEmpty } = require("../utility/util");
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isEmpty(email)) {
            return res.status(400).json({ message: 'Email field is empty' });
        }

        if (isEmpty(password)) {
            return res.status(400).json({ message: 'Password field is empty' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User is already present' });
        }

        const newUser = new User({ email, password });
        const saveUser = await newUser.save();
        if (!saveUser) {
            throw new Error({ message: 'Error saving a new user' });
        }
        const token = createJWTToken({ email, id: newUser.id });
        return res.status(200).json({ message: 'User signup success', token });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isEmpty(email)) {
            return res.status(400).json({ message: 'Email field is empty' });
        }

        if (isEmpty(password)) {
            return res.status(400).json({ message: 'Password field is empty' });
        }

        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(400).json({ message: 'User does not exists' });
        }

        const isPasswordValid = await bcrypt.compare(password, userExists.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = createJWTToken({ email, id: userExists.id });
        return res.status(200).json({ token });

    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

module.exports = {
    signup,
    login
}