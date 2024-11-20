const express = require('express');

const app = express();

// app.use((req,res)=>{
//     res.send("My server has been created succesfully!");
// });

app.use('/test',(req,res)=>{
    res.send("This is the URL named /test");
});

app.use('/hello',(req,res)=>{
    res.send("This is the URL named /hello");
})

app.listen(7779);














