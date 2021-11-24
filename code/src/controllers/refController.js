// 21.09.18 이은비
// Ref에 대한 데이터 처리부분
const Ref = require('../models/ref')
const RefEnrollIngr = require('../models/refEnrollIngr')
const { Op, Sequelize } = require("sequelize");
const { nowDate } = require('../utils/date');

module.exports = class RefController {
    static async createRef(req, res){
        const {refName, explan, refType, ownerNum, colorCode} = req.body

        // 식별자 지정 : yymmdd0000
        const { lastNum } = await Ref.findOne({ 
            where : { refNum : {[Op.like] : `${nowDate()}%` }},
            attributes : [[Sequelize.fn('max', Sequelize.col('ref_num')), 'lastNum']],
            raw: true
        })
        // 해당 날짜에 생성된 엔터티가 없다면 날짜+0001, 있다면 +1
        const refNum = lastNum == null ? nowDate() + '0001' : lastNum + 1

        Ref.create({
            refNum, refName, explan, refType, ownerNum, colorCode
        }).then((result)=> {
            res.status(200).json({
                refNum : result.refNum,
                refName : result.refName, 
                explan : result.explan, 
                refType : result.refType,
                colorCode : result.colorCode,
                ownerNum : result.ownerNum
            })
        }).catch((err) => {
            if (err.name == 'SequelizeValidationError') 
                res.status(400).json({message : "TYPE must be in ('h', 'k', 'v', 'f', 'r')"}) 
            else if(err.name == 'SequelizeForeignKeyConstraintError')
                res.status(404).json({ message: "User Not Found" })
            else res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async readRef(req, res) {
        const { refNum } = req.params;

        Ref.findByPk(
            refNum,{
                include: [{model : RefEnrollIngr, attributes: {exclude: [ 'refNum','createdAt', 'updatedAt', 'deletedAt']}, as : 'enrollIngrs'}], 
                attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']},
                order : [['enrollIngrs', 'expyDate', 'ASC']]
            }
        ).then((result) => {
            result == null 
                ? res.status(404).json({ message: "Not Found" }) : res.status(200).json(result)
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async updateRef(req, res) {
        const {refNum, refName, explan, refType, ownerNum, colorCode} = req.body

        const refInfo = await Ref.findByPk(refNum)
        
        if(!refInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            Ref.update({
                refName : refName || refInfo.refName, 
                // 선택 속성에서 문자열 null로 요청이 들어올 경우 값을 null 설정
                explan : explan == "null" ? null : explan || refInfo.explan, 
                refType : refType || refInfo.refType, 
                ownerNum : ownerNum || refInfo.ownerNum, 
                colorCode : colorCode || refInfo.colorCode
            }, { 
                where : {refNum : refNum}
            }).then((result) => {
                // result가 결과객체를 반환하지 않아서..
                res.status(200).json({
                    refNum : refNum,
                    refName : refName || refInfo.refName, 
                    explan : explan == "null" ? null : explan || refInfo.explan, 
                    refType : refType || refInfo.refType, 
                    ownerNum : ownerNum || refInfo.ownerNum, 
                    colorCode : colorCode || refInfo.colorCode
                })
            }).catch((err) => {
                if (err.name == 'SequelizeValidationError') 
                    res.status(400).json({message : "TYPE must be in ('h', 'k', 'v', 'f', 'r')"}) 
                else res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }

    static async deleteRef(req, res) {
        const { refNum } = req.params;

        const refInfo = await Ref.findByPk(refNum)
        
        if(!refInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            Ref.destroy({ 
                where : {refNum : refNum}
            }).then((result) => {
                res.status(200).json()
            }).catch((err) => {
                res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }

    // 시용자의 모든 냉장고 read
    static async readRefsByUser(req, res){
        const { ownerNum } = req.params

        Ref.findAll({
            where : { ownerNum : ownerNum },
            order : [['refNum', 'ASC'], ['enrollIngrs', 'expyDate', 'ASC']],
            include: [{model : RefEnrollIngr, attributes: {exclude: [ 'refNum','createdAt', 'updatedAt', 'deletedAt']}, as : 'enrollIngrs'}], 
            attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}
        }).then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    // 사용자의 모든 냉장고에 대하여 냉장고 번호만 read
    static async readRefNumsByUser(req, res) {
        const { ownerNum } = req.params;

        Ref.findAll({
            raw: false,
            where : { ownerNum : ownerNum },
            order : [['refNum', 'ASC']],
            attributes: ['refNum']
        }).then((result) => {
            const numList = { 'refNums' : result.map((result) => result.refNum)}
            res.status(200).json(numList)
        }).catch((err) => {
            res.status(500).json({ message: "Internal Server Error" });
        })
    }
}