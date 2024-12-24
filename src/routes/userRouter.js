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
        // console.log(findAllConnectionDetails);
        const data = findAllConnectionDetails.map((row) => {
            if (row.fromUserId._id.toString() === loggedinUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
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

    res.status(200).json({ "message": "Here are the connections requests received", "data":receivedConnectionRequest });
});

userRouter.get('/user/feed', authUserMiddleware, async (req, res) => {

    try{
        const page = parseInt(req.query.page) || 1;

    let limit = parseInt(req.query.limit) || 10;

    limit = (limit > 1000)? 10: limit;

    skip = parseInt((page - 1) * limit);


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
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.status(200).json({ "data": usersTobeShowedInFeed });
    }
    catch(err){
        res.status(400).data(err.message)
    }
});

module.exports = userRouter;
