const express = require('express');
const { connectDB } = require('./config/database');
const cookieParse = require('cookie-parser');
const { authRouter } = require('./routes/authRouter');
const { profileRouter } = require('./routes/profileRouter');
const {requestRouter} = require('./routes/requestRouter');
const userRouter = require('./routes/userRouter');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: "https://devtinder-app.netlify.app",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
}));


app.use(express.json());

app.use(cookieParse());

app.use("/", authRouter);

app.use("/", profileRouter);

app.use("/", requestRouter);

app.use("/",userRouter);


connectDB().then(() => {
    console.log("Database Connected Sucessfully!");
    app.listen(7670, () => {
        console.log("Server is listening to the request!");
    });
}).catch((err) => {
    console.log("Database cannot be connected!");
});

















