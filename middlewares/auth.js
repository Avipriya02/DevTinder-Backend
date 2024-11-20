const getAuthenticate = (req, res, next) =>{
    const token = 'xyz';
    if(token === 'xyz'){
        console.log("Authenticated Successfully!");
        // res.send("Authenticated!");
        next();
    }
    else{
        res.status(201).send("Not Authenticated!");
    }
}
const getUserAuthenticate = (req, res) => {
    res.send("The User Data has been fetched!");
    next();
}
const sendUserAuthenticate = (req,res) => {
    res.send("The User Data has been successfully sent!");
}

const errorHandler = (err, req, res, next) => {
    // if(err){
    //     res.status(500).send("Something Went Wrong!!");
    // }
    console.log(err);
    res.status(500).send("Something Went Wrong!");
}
module.exports={
    getAuthenticate,
    getUserAuthenticate,
    sendUserAuthenticate,
    errorHandler
}