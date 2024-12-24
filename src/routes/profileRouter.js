const { authUserMiddleware } = require('../middlewares/auth');

const express = require('express');

const bcrypt = require('bcrypt');

const { validateProfileEditAPI } = require('../utils/validation');

const profileRouter = express.Router();


profileRouter.get('/profile/view',authUserMiddleware,async(req,res)=>{
    try{
        const user = req.user;
        res.status(200).json({"message":"Here are the details of your profile!","data":user});
    }
    catch(err){
        res.status(400).send("Something Went Wrong!" + err.message);
    }
});

profileRouter.patch('/profile/edit',authUserMiddleware,async(req,res)=>{
    try{
        const isEditAllowed =  validateProfileEditAPI(req);
        if(!isEditAllowed){
            throw new Error("The given fields are not allowed to update!");
        }
        const user = req.user;
        Object.keys(req.body).forEach((key)=>{
            user[key] = req.body[key];
        });
        await user.save();
        res.status(200).json({"message":`${user.firstName} profile data has been updated successfully!`,"data":user});
    }
    catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }
});

profileRouter.patch('/profile/password',authUserMiddleware,async(req,res)=>{
    try{
        const {pass, newPass, cnfPass} = req.body;
        if(!pass || !newPass || !cnfPass){
            throw new Error("The required fields are not present!");
        }
        const user = req.user;
        const isMatchedPassword = await bcrypt.compare(pass,user.password);
        if(!isMatchedPassword){
            throw new Error("Current password did not match!");
        }
        else if(newPass !== cnfPass){
            throw new Error("The new password field and confirm password field did not change!");
        }
        else{
            const newHashedPassword = await bcrypt.hash(newPass,10);
            console.log(newHashedPassword);
            user.password = newHashedPassword;
            user.save();
            res.status(200).json({"message":"Password has changed successfully!","data":user});
        }
    }
    catch(err){
        res.status(400).send("Something Went Wrong!" + err.message);
    }
});

module.exports = { profileRouter };