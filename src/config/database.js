//Logic to connect our database.

const mongoose = require("mongoose");

const connectDB = async() =>{
    await mongoose.connect("mongodb+srv://avipriyapal2000:HR0FlMJFSoDo6CgW@cluster0.4ommffj.mongodb.net/devTinder");
};


module.exports = { connectDB };


