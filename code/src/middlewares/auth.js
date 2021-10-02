// 21.09.30 이은비
// 토큰 인증을 위한 미들웨어어
const jwt = require('../utils/jwt')
const User = require('../models/user')

const authJWT = async(req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')[1];
        const verify = jwt.verityAccess(token)
        
        if(verify.result){
            // 토큰이 위조될 경우를 방지하기 위해
            User.findByPk(verify.userNum)
                .then((result) => {
                    if(result){
                        req.userNum = verify.userNum
                        req.id = verify.id
                        next()
                    } else 
                        res.status(401).json({ "message" :  "Unauthorized"})
                })
        }
        else { 
            res.status(401).json({ "message" :  "Unauthorized"})
        }
    }
}

// 사용자 본인만 가능한 API의 경우 사용할 인증 방식
const authUser = async(req, res, next) => {
    // POST, PUT 
    if(req.userNum == req.body.userNum || req.userNum == req.body.ownerNum || req.userNum == req.body.odererNum)
        next()
    // GET, DELET
    else if(req.userNum == req.params.userNum || req.userNum == req.params.ownerNum || req.userNum == req.params.odererNum)
        next()
    // GET, DELET, params가 여러개일 경우
    else if(req.userNum == req.query.userNum || req.userNum == req.query.ownerNum || req.userNum == req.query.odererNum) 
        next()
    else res.status(401).json({ "message" :  "Unauthorized"})
}


module.exports = { authJWT, authUser}