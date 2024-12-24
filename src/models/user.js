const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 50
        },
        lastName: {
            type: String
        },
        emailId: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            validate: (val) => {
                if (!validator.isEmail(val)) {
                    throw new Error("Email is not valid!");
                }
            }
        },
        password: {
            type: String,
            required: true,
            validate: (val) => {
                if (!validator.isStrongPassword(val)) {
                    throw new Error("The password is not strong enough!");
                }
            }
        },
        age: {
            type: Number,
            validate: (val) => {
                if (val < 18 || val > 90) {
                    throw new Error("The age must be between 18 and 90!");
                }
            }            
        },
        gender: {
            type: String,
            validate: (val) => {
                const gen = ["male", "female", "others"];
                if (!gen.includes(val)) {
                    throw new Error("Not a valid gender!");
                }
            }
        },
        imageUrl: {
            type: String,
            default: 'https://cdn.vectorstock.com/i/1000v/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg'
        },
        about: {
            type: String,
            default: "I love coding!"
        },
        skills: {
            type: Array,
            default: ['JavaScript']
        }
    },
    { timestamps: true }
);

// Generate JWT token
userSchema.methods.getJWT = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "Dev@Tinder9876", { expiresIn: '1d' });
    return token;
};

// Compare password
userSchema.methods.comparePassword = async function (passwordInputUser) {
    const user = this;
    const isPasswordCorrect = await bcrypt.compare(passwordInputUser, user.password);
    console.log(isPasswordCorrect);
    return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
