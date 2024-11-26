const express = require('express');
const User = require('./models/user');
const { connectDB } = require('./config/database');
const { default: mongoose } = require('mongoose');

const app = express();

app.use(express.json());
app.post("/signup",async(req,res)=>{
    const newUser = new User (req.body);
    try{
        await newUser.save();
        res.status(200).send("User has been added successfully!");
    }
    catch(err){
        res.status(400).send("User was not save!" + err.message);
    }
});

app.get('/feed',async(req,res)=>{
    try{
        const listofUsers = await User.find();
        res.status(200).send(listofUsers);
    }
    catch(err){
        res.status(400).send("Something Went Wrong!" + err.message);
    }
});

app.get('/user',async(req,res)=>{
    try{
        const user = await User.findOne({emailId:req.body.emailId});
        if(user){
            res.status(200).send(user);
        }
        else{
            res.status(404).send("User Not Found!");
        }
    }
    catch(err){
        res.status(400).send("Something Went Wrong!" + err.message);
    }
});

app.delete('/user', async(req, res)=>{
    try{
        const user = await User.findByIdAndDelete({_id:req.body.id});
        res.status(200).send("The user has been deleted successfully!");
    }
    catch(err){
        res.status(400).send("Something Went Wrong!" + err.message);
    }
});

// app.patch('/user',async(req,res)=>{
//     try{
//         const updateUser = await User.findByIdAndUpdate({_id:req.body._id},{emailId:req.body.emailId});
//         res.status(200).send("The user details has been succesfully updated!");
//     }
//     catch(err){
//         res.status(400).send("Something Went Wrong!");
//     }
// });
app.patch('/user',async(req,res)=>{
    try{
        const updationAllowedFields = ["emailId", "lastName", "password", "age", "gender"];
        console.log(req.body);
        const checkingifAllowed = Object.keys(req.body).every(
            (field)=>
                updationAllowedFields.includes(field)
        ); 
        console.log(checkingifAllowed);
        if(!checkingifAllowed)
            throw new Error("There are some fields present updation of which is not allowed!")
        else{
            await User.findOneAndUpdate({emailId:req.body.emailId},{lastName:req.body.lastName},{runValidators:true});
            res.status(200).send("The user details has been updated successfully!");
        }
    }
    catch(err){
        res.status(400).send("Something Went Wrong!" + err.message);
    }
})

connectDB().then(()=>{
    console.log("Database Connected Sucessfully!");
    app.listen(7670,()=>{
        console.log("Server is listening to the request!");
    });
}).catch((err)=>{
    console.log("Database cannot be connected!");
});

















