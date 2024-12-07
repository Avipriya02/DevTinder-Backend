const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        firstName: {type:String, required:true,minlength:4,maxlength:50},
        lastName: {type: String},
        emailId: {type: String,
            unique:true,
            trim: true,
            lowercase:true,
            validate:(val)=>{
                if(!validator.isEmail(val)){
                    throw new Error("Email is not valid!");
                }
            }
        },
        password: {type: String,
            required:true,
            validate:(val)=>{
                if(!validator.isStrongPassword(val)){
                    throw new Error("The password is not strong enough!");
                }
            }
        },
        age:{type:Number, min:18},
        gender:{type:String,validate:(val)=>{
            const gen = ["male","female","others"];
            if(!gen.includes(val)){
                throw new Error("Not a valid gender!");
            }
        }},
        imageUrl:{
            type: String,
            default:'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png'
        },
        about:{type:String,default:"I love coding!"}},
    { timestamps: true },
);

userSchema.methods.getJWT = function(){
    const user = this;
    const token = jwt.sign({ _id: user._id }, "Dev@Tinder9876",{ expiresIn: '1d' });
    return token;
}

userSchema.methods.comparePassword = async function(passwordInputUser){
    const user = this;
    const isPassWordCorrect = await bcrypt.compare(passwordInputUser, user.password);
    return isPassWordCorrect;
}

const User = mongoose.model("User",userSchema);

module.exports = User;