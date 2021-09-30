// 21.09.18 이은비
// User에 대한 데이터 처리부분
const User = require('../models/user')
const jwt = require('../utils/jwt')
var crypto = require('crypto');

module.exports = class UserController {
    static async createUser(req, res){
        const {id, pwd, nickname, email, linkId } = req.body;
        
        // 비밀번호 암호화
        let salt = Math.round((new Date().valueOf() * Math.random())) + "";
        let hashPassword = crypto.createHash("sha512").update(pwd + salt).digest("hex");

        User.create({
            id, pwd : hashPassword, nickname, email, linkId, salt
        }).then((result) => {
            // 패스워드, salt는 보안상의 문제로 제외
            res.status(200).json({
                userNum : result.userNum,
                id : result.id, 
                nickname : result.nickname, 
                email : result.email, 
                linkId : result.linkId
            })
        }).catch((err) => {
            // 유효성 검사에 따른 응답
            err.name ==  "SequelizeUniqueConstraintError" ?
                res.status(400).json({message : "ID is not uniqe"}) : res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async readUser(req, res) {
        const { userNum } = req.params;

        User.findByPk(
            // 비밀번호는 보안상의 문제로 제외.
            userNum, {attributes: {exclude: [ 'pwd', 'salt','createdAt', 'updatedAt', 'deletedAt']}}
        ).then((result) => {
            result == null 
                ? res.status(404).json({ message: "Not Found" }) : res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async updateUser(req, res) {
        const {userNum, id, pwd, nickname, email, linkId} = req.body
        let salt, hashPassword = null

        // 비밀번호 변경 시, 비밀번호 암호화
        if(pwd){
            salt = Math.round((new Date().valueOf() * Math.random())) + "";
            hashPassword = crypto.createHash("sha512").update(pwd + salt).digest("hex");
        }

        // 해당 유저가 존재하는지 알기 위해.
        const userInfo = await User.findByPk(userNum);
        
        if(!userInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            User.update({
                    id : id || userInfo.id,
                    pwd : hashPassword || userInfo.pwd,
                    nickname : nickname || userInfo.nickname, 
                    email : email || userInfo.email, 
                    linkId : linkId || userInfo.linkId,
                    salt : salt || userInfo.salt
                }, { 
                    where : {userNum : userNum}
                }) .then((result) => {
                // 패스워드, salt는 보안상의 문제로 제외
                // result가 결과객채를 반환하지 않아서..
                res.status(200).json({
                    userNum : userNum, 
                    id : id || userInfo.id,
                    nickname : nickname || userInfo.nickname, 
                    email : email || userInfo.email, 
                    linkId : linkId || userInfo.linkId,
                })
            }).catch((err) => {
                // 유효성 검사에 따른 응답
                err.name ==  "SequelizeUniqueConstraintError" ?
                res.status(400).json({message : "ID is not uniqe"}) : res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }

    static async deleteUser(req, res) {
        const { userNum } = req.params;

        // 해당 유저가 존재하는지 알기 위해.
        const userInfo = await User.findByPk(userNum);
        
        if(!userInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            User.destroy({
                where : {userNum : userNum}
            }).then((result) => {
                res.status(200).json()
            }).catch((err) => {
                res.status(500).json({ message: "Internal Server Error" });
            })

        }
    }

    // login
    static async login(req, res) {
        const { id, pwd } = req.body
        
        const userInfo = await User.findOne({where : { id : id }}) 
        let hashPassword = crypto.createHash("sha512").update(pwd + userInfo.salt).digest("hex");

        if (hashPassword === userInfo.pwd) {
            const accessToken = jwt.accessToken(userInfo);
            const refreshToken = jwt.refreshToken();

            // DB에 refresh token 저장.
            User.update({
                    refreshToken : refreshToken
                }, { 
                    where : {id : id} 
                }).then((result) => {
                    res.status(200).json({ 
                        accessToken : accessToken,
                        refreshToken : refreshToken
                    })
                }).catch((err) => {
                    console.log(err)
                    res.status(500).json({ message: "Internal Server Error" });
                })
        }
    }

    // logout
    static async logout(req, res){
        const { id } = req.params;

        User.update({
                refreshToken : null
            },{
                where : { id : id }
        }).then((result) => {
            res.status(200).json()
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" });
        })
    }
}