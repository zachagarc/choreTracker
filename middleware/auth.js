const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    
    const token = req.header('x-auth-token');
    if(!token) {
        return res.status(401).json({msg: "No web token sent, authorization denied"});
    }

    try {
        const decoded = jwt.verify(token, config.get('secret'));
        req.user = decoded.user;
        next();
    } catch(err) {
        console.error(err);
        res.status(401).json({msg: "Token is not valid"});
    }
}