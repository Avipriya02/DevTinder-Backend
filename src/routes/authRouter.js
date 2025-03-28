const express = require('express');
const bcrypt = require('bcrypt');

const { validateLoginAPI, validateSignUpAPI } = require('../utils/validation');


const authRouter = express.Router();

const User = require('../models/user');

authRouter.post("/login", async (req, res) => {
    try {
        validateLoginAPI(req);
        const userInfo = await User.findOne({ emailId: req.body.emailId });
        console.log(userInfo);
        if (!userInfo) {
            throw new Error("Invalid Credentials!");
        }
        const isPasswordCorrect = await userInfo.comparePassword(req.body.password);
        console.log(isPasswordCorrect);
        if (!isPasswordCorrect)
            throw new Error("Invalid Credentials!");
        else {
            const token = await userInfo.getJWT();
res.cookie("token", token, {
    httpOnly: true,      // Prevents JavaScript access to the cookie
    secure: true,        // Required for HTTPS (Netlify needs this)
    sameSite: "None",    // Needed for cross-origin cookies
    path: "/",           // Ensures cookie is sent with every request
    expires: new Date(Date.now() + 86400000) // 1 day expiration
});

            res.status(200).json(userInfo);
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
        const token = await newUser.getJWT();
res.cookie("token", token, {
    httpOnly: true,      // Prevents JavaScript access to the cookie
    secure: true,        // Required for HTTPS (Netlify needs this)
    sameSite: "None",    // Needed for cross-origin cookies
    path: "/",           // Ensures cookie is sent with every request
    expires: new Date(Date.now() + 86400000) // 1 day expiration
});

        res.status(200).send(newUser);

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
