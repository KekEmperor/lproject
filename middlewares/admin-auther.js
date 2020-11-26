const jwt = require('jsonwebtoken');
const config = require('../config/default.json');

module.exports = (req, res, next) => {
    const token = req.headers['x-auth-token'];

    if (!token) {
        return res.status(401)
            .send('Access denied');
    }

    try {
        const decoded = jwt.verify(token, config.appPrivateKey);
        req.admin = decoded;
        next();
    }
    catch {
        res.status(401)
            .send('Invalid token');
    }
}