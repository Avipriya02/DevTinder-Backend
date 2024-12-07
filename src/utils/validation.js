const validator = require('validator');

const validateSignUpAPI = (req) => {
    // Check if req.body exists
    if (!req.body) {
        throw new Error("No parameters are present!");
    }

    // Destructure properties from req.body
    const { firstName, emailId, password } = req.body;

    // Validate firstName
    if (!firstName) {
        throw new Error("First Name is required!");
    }

    // Validate emailId
    if (!emailId || !validator.isEmail(emailId)) {
        throw new Error("A valid email ID is required!");
    }

    // Validate password
    if (!password || !validator.isStrongPassword(password)) {
        throw new Error(
            "A strong password is required! Password must include at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol."
        );
    }
};

const validateLoginAPI = (req)=>{
     // Check if req.body exists
     if (!req.body) {
        throw new Error("No parameters are present!");
    }

    // Destructure properties from req.body
    const { emailId, password } = req.body;
    if (!emailId || !password){
        throw new Error("The required fields are missing!");
    }
}

const validateProfileEditAPI = (req)=>{
    const editableFields = ['skills', 'about', 'photoUrl', 'age', 'firstName', 'lastName', 'gender'];
    if(!req || !req.body){
        throw new Error("There are no fields to update!");
    }
    const body = req.body;
    const isEditAllowed = Object.keys(body).every(
        (field)=>{ return editableFields.includes(field);
        })
    return isEditAllowed;
}

module.exports = { validateSignUpAPI,validateLoginAPI,validateProfileEditAPI };