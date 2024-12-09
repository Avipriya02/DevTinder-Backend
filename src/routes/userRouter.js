const express = require('express');

const userRouter = express.Router();

const { authUserMiddleware } = require('../middlewares/auth');

const connectionRequest = require('../models/connectionRequest');

const User = require('../models/user');

const USER_SAFE_DATA = "firstName lastName about gender imageUrl";

userRouter.get('/user/connections', authUserMiddleware, async (req, res) => {
    try {
        const loggedinUser = req.user;
        const findAllConnectionDetails = await connectionRequest.find({
            $or: [{ fromUserId: loggedinUser._id, status: "accepted" },
            { toUserId: loggedinUser._id, status: "accepted" }]
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        const data = findAllConnectionDetails.map((field) => {
            if (field.fromUserId.toString() === loggedinUser._id.toString()) {
                return field.toUserId;
            }
            return field.fromUserId;
        })

        res.status(200).json({ "message": "Here are your all connection details:", data });
    }
    catch (err) {
        res.status(400).send("Something Went Wrong! " + err.message);
    }
});

userRouter.get('/user/request/received', authUserMiddleware, async (req, res) => {
    const loggedinUser = req.user;
    const receivedConnectionRequest = await connectionRequest.find({
        toUserId: loggedinUser._id,
        status: 'interested'
    }).populate("fromUserId", USER_SAFE_DATA);
    if (!receivedConnectionRequest) {
        return res.status(400).send("No connection requests received!");
    }

    const data = receivedConnectionRequest.map((record) => {
        return record.fromUserId;
    })

    res.status(200).json({ "message": "Here are the connections requests received", data });
});

userRouter.get('/user/feed', authUserMiddleware, async (req, res) => {

    const loggedinUser = req.user;


    const hideConnections = await connectionRequest.find({
        $or: [
            { fromUserId: loggedinUser._id },
            { toUserId: loggedinUser._id }
        ]
    }).select("fromUserId toUserId");

    const hideConnectionsId = new Set();

    hideConnections.forEach((connectionId) => {
        hideConnectionsId.add(connectionId.fromUserId.toString());
        hideConnectionsId.add(connectionId.toUserId.toString());
    });

    const usersTobeShowedInFeed = await User.find({
        $and: [{_id: {$nin: Array.from(hideConnectionsId)}},
             {_id:{$ne: loggedinUser._id}}]
    }).select(USER_SAFE_DATA);

    res.status(200).json({ "data": usersTobeShowedInFeed });
});

module.exports = userRouter;