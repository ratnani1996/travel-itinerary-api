const { verifyJWTToken } = require("../utility/jwtToken");
const { isEmpty } = require("../utility/util");


const verifyToken = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (isEmpty(authorization) || !authorization.startsWith('Bearer')) {
            return res.status(400).json({ message: 'Token is not present or invalid' });
        }
        const token = authorization.split(' ')[1];
        const validToken = verifyJWTToken(token, process.env.JWT_SECRET);
        if (!validToken) {
            return res.status(400).json({ message: 'Token is invalid' });
        }
        req.user = validToken;
        next();
    }
    catch (error) {
        console.error('JWT verification failed:', error.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }

}

module.exports = {
    verifyToken
}