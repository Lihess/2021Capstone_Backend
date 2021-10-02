// 21.09.30 이은비
// jwt를 이용한 로그인 구현을 위해 유틸리티 정의의
const jwt = require('jsonwebtoken');
const secret =  require('../config/jwt.json')["secret_key"]
const User = require('../models/user')

module.exports = {
    // accessToken 발급
    accessToken : (user) => {
        // 토큰에 넣어줄 정보
        const payload = {
            userNum : user.userNum,
            id : user.id
        };

        return jwt.sign(payload, secret, {
            algorithm : 'HS256',
            expiresIn : '1h'
        });
    },

    // access token 검증
    verityAccess : (token) => {
        try {
            const decode =  jwt.verify(token, secret);
            
            return { 
                result : true,
                userNum : decode.userNum,
                id : decode.id
            } 
        } catch(err) {
            return { 
                result : false,
                message : err.message 
            };
        }
    },

    // refresh token 발급
    refreshToken : () => {
        // payload 없이 발급
        return jwt.sign({}, secret, {
            algorithm : 'HS256',
            expiresIn : '14d'
        });
    },

    // refresh token 검증 
    verifyRefresh : async(token, userNum) => {
        // DB에 저장된 token을 불러옴옴
        const userInfo = await User.findOne({
            where : {userNum : userNum}
        })
   
        // 검증 전 우선 같은지 확인
        if (token === userInfo.refreshToken) {
            try {
                jwt.verify(token, secret);
                return { result : true };
            } catch(err){
                return { 
                    result : false,  
                    message : err.message 
                };
            }
        } else {
            return { 
                result : false,  
                message : 'Not identical'
            };
        }
    }
}