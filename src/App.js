const express = require('express');

const { getAuthenticate, getUserAuthenticate, sendUserAuthenticate, errorHandler } = require('../middlewares/auth');

const app = express();

app.use('/auth', getAuthenticate);

app.get('/auth',getUserAuthenticate);

app.post('/auth', sendUserAuthenticate);

app.use('/auth',errorHandler);

app.listen(7770);















