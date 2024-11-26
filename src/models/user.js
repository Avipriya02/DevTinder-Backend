const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: {type:String, required:true,minlength:4},
        lastName: {type: String,default:"NA"},
        emailId: {type: String,unique:true,trim: true,lowercase:true,match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/},
        password: {type: String},
        age:{type:Number, min:18},
        gender:{type:String,validate:(val)=>{
            const gen = ["male","female","others"];
            if(!gen.includes(val)){
                throw new Error("Not a valid gender!");
            }
        }}
    }
);

const User = mongoose.model("User",userSchema);

module.exports = User;

