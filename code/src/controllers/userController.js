// 21.09.18 이은비
// User에 대한 데이터 처리부분
const User = require('../models/user')
const jwt = require('../utils/jwt')
const axios = require('axios');
const { Op, Sequelize, where } = require("sequelize");
const { nowDate } = require('../utils/date');
var crypto = require('crypto');
const mailSender = require('../utils/mail');

module.exports = class UserController {
    static async createUser(req, res){
        const {id, pwd, nickname, email, linkId } = req.body;
        
        // 식별자 지정 : yymmdd0000
        const { lastNum } = await User.findOne({ 
                            where : { userNum : {[Op.like] : `${nowDate()}%` }},
                            attributes : [[Sequelize.fn('max', Sequelize.col('user_num')), 'lastNum']],
                            raw: true
                        })
        // 해당 날짜에 생성된 엔터티가 없다면 날짜+0001, 있다면 +1
        const userNum = lastNum == null ? nowDate() + '0001' : lastNum + 1
        
        // 비밀번호 암호화
        let salt = Math.round((new Date().valueOf() * Math.random())) + "";
        let hashPassword = crypto.createHash("sha512").update(pwd + salt).digest("hex");

        User.create({
            userNum, id, pwd : hashPassword, nickname, email, linkId, salt
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
                res.status(400).json({message : `${err.errors[0].path.toUpperCase().split('_')[0]} is not uniqe`}) 
                : res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async readUser(req, res) {
        const { userNum } = req.params;

        User.findByPk(
            // 비밀번호는 보안상의 문제로 제외.
            userNum, {attributes: {exclude: [ 'pwd', 'salt', 'refreshToken', 'linkToken','createdAt', 'updatedAt', 'deletedAt']}}
        ).then((result) => {
            result == null 
                ? res.status(404).json({ message: "Not Found" }) : res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async updateUser(req, res) {
        const {userNum, id, pwd, nickname, email, linkId, linkToken} = req.body
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
                    // 선택 속성에서 문자열 null로 요청이 들어올 경우 값을 null 설정
                    linkId : linkId == "null" ? null : linkId || userInfo.linkId,
                    linkToken : linkToken == "null" ? null : linkToken || userInfo.linkToken,
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
                    linkId : linkId == "null" ? null : linkId || userInfo.linkId,
                    linkToken : linkToken == "null" ? null : linkToken || userInfo.linkToken,
                })
            }).catch((err) => {
                // 유효성 검사에 따른 응답
                err.name ==  "SequelizeUniqueConstraintError" ?
                    res.status(400).json({message : `${err.errors[0].path.toUpperCase().split('_')[0]} is not uniqe`}) 
                    : res.status(500).json({ message: "Internal Server Error" });
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

        console.log(userInfo.userNum)

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
                        userNum : userInfo.userNum,
                        accessToken : accessToken,
                        refreshToken : refreshToken
                    })
                }).catch((err) => {
                    console.log(err)
                    res.status(500).json({ message: "Internal Server Error" });
                })
        } else res.status(400).json({ message: "Not match" });
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

    static async findId(req, res){
        const { email } = req.body

        const userInfo = await User.findOne({ where : { email : email }})

        if(userInfo){
            const html = `
                <center>
                    <div style="padding: 10px; width: 500px;">
                        <div style="width : 100%; text-align: left;" >
                            <h2 style="border-bottom : 2px solid #7cc9d1;"> 아이디 안내 </h2>
                            <p>안녕하세요, Better Before 입니다.</p></br>
                            <p>요청하신 아이디 정보를 보내드립니다.</p>
                        </div>
                        <div style=" margin-top: 40px; background-color:#F0F6F5; border: 1px solid #b5d9d8; height: 50px; width: 400px; display: flex; flex-direction: column; justify-content: center;">
                            <p style="text-align: center; color: black;"> 아이디는 <b>${userInfo.id}</b>입니다.</p>
                        </div>
                        <div  style="margin-top: 40px; width : 100%; height: 50px;background-color:#f5f5f7;display: flex;flex-direction: column;justify-content: center;" >
                            <p style="text-align: center; color: #7c7c86"> 
                                본 이메일은 Better-Before에서 발송된 메일입니다. 
                            </p>
                        </div>
                    </div>
                </center>`

            mailSender.sendMail(email, "[Better Before] 귀하의 아이디를 알려드립니다.", html)
                .then((result) => {
                    res.status(200).json()
                }).catch((err) => {
                    res.status(500).json({ message: "Mail send fail" });
                })
        } else {
            res.status(400).json("Not match")
        }
    }

    // 패스워드 찾기 : 패스워드 재설정 후 메일 전송
    static async findPwd(req, res){
        const { email, id } = req.body
        
        const userInfo = await User.findOne({ where : { email : email, id : id }})

        if(userInfo){
            //  Math.random().toString(36) 시, 난수로 소수점이 붙어서 나옴
            const newPwd = Math.random().toString(36).slice(2);

            const html = `
                <center>
                    <div style="padding: 10px; width: 500px;">
                        <div style="width : 100%; text-align: left;" >
                            <h2 style="border-bottom : 2px solid #7cc9d1;"> 비밀번호 재설정 </h2>
                            <p>안녕하세요, Better Before 입니다.</p>
                            <p>재설정된 비밀번호를 알려드립니다.</p>
                            <p>해당 비밀번호로 로그인 후, <b>반드시 비밀번호를 변경해주세요.</b></p>
                        </div>
                        <div style=" margin-top: 40px; background-color:#F0F6F5; border: 1px solid #b5d9d8; height: 50px; width: 400px; display: flex; flex-direction: column; justify-content: center;">
                            <p style="text-align: center; color: black;"> 새로운운 비밀번호는 <b>${newPwd}</b>입니다.</p>
                        </div>
                        <div  style="margin-top: 40px; width : 100%; height: 50px;background-color:#f5f5f7;display: flex;flex-direction: column;justify-content: center;" >
                            <p style="text-align: center; color: #7c7c86"> 
                                본 이메일은 Better-Before에서 발송된 메일입니다. 
                            </p>
                        </div>
                    </div>
                </center>`
            const salt = Math.round((new Date().valueOf() * Math.random())) + "";
            const hashPassword = crypto.createHash("sha512").update(newPwd + salt).digest("hex");

            // 새로 설정된 비밀번호로 변경
            User.update({
                    pwd : hashPassword, 
                    salt : salt
                }, {where : { email : email, id : id }})
                .then(() => {
                    mailSender.sendMail(email, "[Better Before] 귀하의 새로운 비밀번호를 알려드립니다.", html)
                    .then((result) => {
                            res.status(200).json()
                        }).catch((err) => {
                            res.status(500).json({ message: "Mail send fail" });
                        })
                }).catch((err) => {
                    res.status(500).json({ message: "Internal Server Error" });
                })
        } else {
            res.status(400).json("Not match")
        }
    }

    // 쇼핑몰 연동
    // 느낌만 주기위해서 OAuth 사용
    static async linkUser(req, res){
         const result = await axios.post(
                "https://github.com/login/oauth/access_token",{
                client_id : process.env.GITHUB_CLIENT_ID,
                client_secret : process.env.GITHUB_CLIENT_SECRET,
                code : req.query.code
            }).catch((err) => {
                console.log(err)
                res.status(500).json({ message: "Internal Server Error" })
            });
        
        const token = result.data.split('&')[0].split('=')[1];

        const { data } = await axios.get('https://api.github.com/user', {
                    headers: {
                      Authorization: `token ${token}`,
                    },
                }).catch((err) => {
                    console.log(err)
                    res.status(500).json({ message: "Internal Server Error" })
                });
       
        res.status(200).json({ linkToken : token, linkId : data.id })
    }
}