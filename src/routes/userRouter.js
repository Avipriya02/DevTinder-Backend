const express = require('express');

const userRouter = express.Router();

const { authUserMiddleware } = require('../middlewares/auth');

const connectionRequest = require('../models/connectionRequest');

const USER_SAFE_DATA = "firstName lastName about gender imageUrl";

userRouter.get('/user/connections', authUserMiddleware, async(req, res)=>{
    try{
        const loggedinUser = req.user;
        const findAllConnectionDetails = await connectionRequest.find({
            $or:[{fromUserId: loggedinUser._id,status:"accepted"},
            {toUserId: loggedinUser._id, status:"accepted"}]
        })
        .populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA);

        const data = findAllConnectionDetails.map((field)=>{
            if(field.fromUserId.toString()===loggedinUser._id.toString()){
                return field.toUserId;
            }
            return field.fromUserId;
        })

        res.status(200).json({"message":"Here are your all connection details:",data});
    }
    catch(err){
        res.status(400).send("Something Went Wrong! " + err.message);
    }
});

userRouter.get('/user/request/received',authUserMiddleware,async(req,res)=>{
    const loggedinUser = req.user;
    const receivedConnectionRequest = await connectionRequest.find({
        toUserId: loggedinUser._id,
        status: 'interested'
    }).populate("fromUserId",USER_SAFE_DATA);
    if(!receivedConnectionRequest){
        return res.status(400).send("No connection requests received!");
    }

    const data = receivedConnectionRequest.map((record)=>{
        return record.fromUserId;
    })

    res.status(200).json({"message":"Here are the connections requests received",data});
});

module.exports = userRouter;
