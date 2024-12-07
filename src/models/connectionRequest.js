const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values: ["ignored","interested","accepted","rejected"],
            message: `{VALUE} is an incorrect status.`
        }
    }
},{timestamps:true});

connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send request to yourself!");
    }
    next();
});


const connectionRequest = new mongoose.model("connectionRequest",connectionRequestSchema);


module.exports = connectionRequest