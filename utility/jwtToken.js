const jwt = require("jsonwebtoken")


const createJWTToken = (userDetails) => {
    const {
        email,
        id
    } = userDetails;
    const token = jwt.sign({
        email,
        id
    },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        });
    return token;
}

const verifyJWTToken = (token) =>{
    return jwt.verify(token, process.env.JWT_SECRET);
}


module.exports = {
    createJWTToken,
    verifyJWTToken
}