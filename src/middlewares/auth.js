const loginHandler = (req, res) =>{
    res.send("Logged In Suceesfully!");
}
const getAuthenticate = (req, res, next) => {
    const token = 'xyz';
    if (token === 'xyz') {
        console.log("Authenticated Successfully!");
        next();
    }
    else {
        res.status(201).send("Not Authenticated!");
    }
}
const getUserAuthenticate = (req, res) => {
    res.send("The User Data has been fetched!");
}
const sendUserAuthenticate = (req, res) => {
    try {
        res.send("The User Data has been successfully sent!");
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something unexpected happened");
    }
}

const errorHandler = (err, req, res, next) => {
    if (err) {
        console.log(err);
        res.status(500).send("Something Went Wrong!!");
    }
}

const wrongPathHandler =(req, res) =>{
    res.status(404).send("The path does not exist!");
}

module.exports = {
    loginHandler,
    getAuthenticate,
    getUserAuthenticate,
    sendUserAuthenticate,
    errorHandler,
    wrongPathHandler
}