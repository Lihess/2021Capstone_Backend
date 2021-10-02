// 21.09.30 이은비
// 토큰 재발급을 위한 미들웨어
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { accessToken, refreshToken, verityAccess, verifyRefresh} = require('../utils/jwt')

const refresh = async(req, res) => {
    // 토큰의 존재 여부 확인
    if (req.headers.authorization && req.headers.refresh) {
        const token = req.headers.authorization.split('Bearer ')[1];
        const refresh = req.headers.refresh;
        
        // access token 검증
        const authAccess = verityAccess(token);
        const decode = jwt.decode(token);
        
        // decode 내에 payload가 존재하지 않다면 권한 x
        if(!decode.userNum) {
            res.status(401).json({ "message" :  "Unauthorized"})
        }

        const authRefresh = await verifyRefresh(refresh, decode.userNum)
    
        if(!authAccess.result && (authAccess.message === 'jwt expired')){
            // 1. 두 토큰이 모두 만료된 경우, 새로 로그인 필요
            if(!authRefresh.result)
                res.status(401).json({ "message" :  "Unauthorized"})
            else {
                // 2. refresh token은 만료되지 않은 경우 access token, refresh token 재발급
                // 장기적인 로그인 유지를 위해 refresh도 재발급
                const newAccessToken = accessToken(decode);
                const newRefreshToken = refreshToken();

                User.update({
                    refreshToken : newRefreshToken
                }, { 
                    where : {id : decode.id} 
                }).then(() => {
                    res.status(200).json({
                        accessToken : newAccessToken,
                        refreshToken : newRefreshToken
                    })
                }).catch((err) => {
                    console.log(err)
                    res.status(500).json({ message: "Internal Server Error" });
                })
            }
        } else {
            // 3. 토큰이 만료되지 않은 경우
            res.status(400).json({ 'message' : 'Token is not expired' })
        }
    } else {
        // 두 토큰 중 하나라도 없다면
        res.status(400).json({ 'message' : 'Token is not in the Header' })
    }
}

module.exports = refresh;