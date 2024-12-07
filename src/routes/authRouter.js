const express = require('express');
const bcrypt = require('bcrypt');

const { validateLoginAPI, validateSignUpAPI } = require('../utils/validation');


const authRouter = express.Router();

const User = require('../models/user');

authRouter.post("/login", async (req, res) => {
    try {
        validateLoginAPI(req);
        const userInfo = await User.findOne({ emailId: req.body.emailId });
        if (!userInfo) {
            throw new Error("Invalid Credentials!");
        }
        const isPasswordCorrect = await userInfo.comparePassword(req.body.password);
        if (!isPasswordCorrect)
            throw new Error("Invalid Credentials!");
        else {
            const token = await userInfo.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 900000)
            });
            res.status(200).send("User Authenticated Successfully!");
        }
    }
    catch (err) {
        res.status(400).send(err.message);
    }

});

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpAPI(req);
        const { firstName, lastName, emailId, password, imageUrl, about,gender} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, emailId, password: hashedPassword,imageUrl, about,gender });
        await newUser.save();
        res.status(200).send("User has been added successfully!");
    }
    catch (err) {
        res.status(400).send("User was not saved!" + err.message);
    }
});

authRouter.post('/logout', async (req, res) => {
    res.clearCookie('token');
    res.status(200).send("Logged Out Successfully!");
})



module.exports = { authRouter };