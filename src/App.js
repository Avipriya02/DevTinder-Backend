const express = require('express');

const { connectDB } = require('./config/database');

const app = express();


connectDB().then(()=>{
    console.log("Database Connected Sucessfully!");
    app.listen(7670,()=>{
        console.log("Server is listening to the request!");
    });
}).catch((err)=>{
    console.log("Database cannot be connected!");
});

















