// 21.09.30 이은비
// 토큰 인증을 위한 미들웨어어
const jwt = require('../utils/jwt')

const authJWT = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')[1];

        if(jwt.verityAccess(token).result)
            next()
        else { 
            res.status(401).json({ "message" :  "Unauthorized"})
        }
    }
}

module.exports = authJWT