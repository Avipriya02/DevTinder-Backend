const { authUserMiddleware } = require('../middlewares/auth');

const express = require('express');

const user = require('../models/user');

const connectionRequest = require('../models/connectionRequest');

const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:toUserId', authUserMiddleware, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const status = req.params.status;
        const toUserId = req.params.toUserId;

        const statusAccepted = ["interested", "ignored"];

        if (!statusAccepted.includes(status))
            return res.status(400).json({ "message": "Status is not invalid!" });

        const toUserDetails = await user.findById(toUserId);

        if (!toUserDetails) {
            return res.status(400).json({ "message": "User does not exist!" });
        }
        const existingConnectionRequest = await connectionRequest.findOne({
            $or: [{ fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnectionRequest) {
            return res.status(400).json({ "message": "Connection Request Already exists!" });
        }
        const newConnectionRequest = new connectionRequest({ fromUserId, toUserId, status });
        const data = await newConnectionRequest.save();
        res.status(200).json({ "message": `Connection request was ${status} from ${req.user.firstName} to ${toUserDetails.firstName}`, data });
    }
    catch (err) {
        res.status(400).send("Something went wrong!" + err.message);
    }
});

module.exports = { requestRouter };