// 21.09.18 이은비
// Ref에 대한 데이터 처리부분
const Ref = require('../models/ref')
const RefEnrollIngr = require('../models/refEnrollIngr')

module.exports = class RefController {
    static async createRef(req, res){
        const {refName, explan, refType, ownerNum, colorCode} = req.body

        Ref.create({
            refName, explan, refType, ownerNum, colorCode
        }).then((result)=> {
            res.status(200).json({
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
                attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}
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
                explan : explan || refInfo.explan, 
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
                    explan : explan || refInfo.explan, 
                    refType : refType || refInfo.refType, 
                    ownerNum : ownerNum || refInfo.ownerNum, 
                    colorCode : colorCode || refInfo.colorCode
                })
            }).catch((err) => {
                if (err.name == 'SequelizeValidationError') 
                    res.status(400).json({message : "TYPE must be in ('h', 'k', 'v', 'f', 'r')"}) 
                else if(err.name == 'SequelizeForeignKeyConstraintError')
                    res.status(404).json({ message: "User Not Found" })
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

    static async readRefbyOwner(req, res){
        const { ownerNum } = req.params

        Ref.findAll({
            where : { ownerNum : ownerNum },
            include: [{model : RefEnrollIngr, attributes: {exclude: [ 'refNum','createdAt', 'updatedAt', 'deletedAt']}, as : 'enrollIngrs'}], 
            attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}
        }).then((result) => {
            console.log(result)
            result == null 
                ? res.status(404).json({ message: "Not Found" }) : res.status(200).json(result)
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" });
        })
    }
}