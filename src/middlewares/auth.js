const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authUserMiddleware = async(req,res,next) =>{
    try{
        const { token } = req.cookies;
        if(!token){
            throw new Error("Token Not Found!");
        }
        const decodedData = await jwt.verify(token, "Dev@Tinder9876");
        const user = await User.findOne({_id:decodedData._id});
        if(!user){
            throw new Error("User Not Found!");
        }
        else{
            req.user = user;
            next();
        }
    }
    catch(err){
        res.status(400).send(err.message);
    }

}

module.exports = {
    authUserMiddleware
}