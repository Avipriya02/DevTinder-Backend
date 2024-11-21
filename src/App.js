const express = require('express');

const { loginHandler, getAuthenticate,  getUserAuthenticate, sendUserAuthenticate, errorHandler, wrongPathHandler } = require('../middlewares/auth');

const app = express();

// app.use('/auth', getAuthenticate);

app.post('/auth/login',loginHandler);

app.get('/auth',getAuthenticate, getUserAuthenticate);

app.post('/auth', getAuthenticate, sendUserAuthenticate);

app.use('/', errorHandler);

app.use('/', wrongPathHandler);

app.listen(7670);















