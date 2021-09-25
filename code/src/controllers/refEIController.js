// 21.09.18 이은비
// RefEnrollIngr에 대한 데이터 처리부분
const RefEI = require('../models/refEnrollIngr')

module.exports = class RefController {
    static async createRefEI(req, res){
        const {refNum, ingrName, expyDate, quantity, storageMthdType, presetIngrNum} = req.body

        RefEI.create({
            refNum, ingrName, expyDate, quantity, storageMthdType, presetIngrNum
        }).then((result)=> {
            res.status(200).json({
                refNum : result.refNum, 
                ingerOrnu : result.ingerOrnu,
                ingrName : result.IngrName, 
                enrollDate : result.enrollDate,
                expyDate : result.expyDate, 
                quantity : result.quantity, 
                storageMthdType : result.storageMthdType, 
                presetIngrNum : result.presetIngrNum
            })
        }).catch((err) => {
            console.log(err)
            if (err.name == 'SequelizeValidationError') 
                res.status(400).json({message : "TYPE must be in ('f', 'r', 'a')"}) 
            else if(err.name == 'SequelizeForeignKeyConstraintError')
                res.status(404).json({ message: "Ref or PresetIngr Not Found" })
            else res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async readRefEI(req, res) {
        const { refNum, ingrOrnu } = req.query;

        RefEI.findOne({
            where : {refNum : refNum, ingrOrnu : ingrOrnu}},{
            attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}
        }).then((result) => {
            result == null 
                ? res.status(404).json({ message: "Not Found" }) : res.status(200).json(result)
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async updateRefEI(req, res) {
        const {refNum, ingrOrnu, ingrName, expyDate, quantity, storageMthdType, presetIngrNum} = req.body

        const refEIInfo = await RefEI.findOne({where : {refNum : refNum, ingrOrnu : ingrOrnu}})
        
        if(!refEIInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            RefEI.update({
                ingrName : ingrName || refEIInfo.IngrName, 
                expyDate : expyDate || refEIInfo.expyDate, 
                quantity : quantity || refEIInfo.quantity, 
                storageMthdType : storageMthdType || refEIInfo.storageMthdType, 
                presetIngrNum : presetIngrNum || refEIInfo.presetIngrNum
            }, { 
                where : {refNum : refNum}
            }).then((result) => {
                // result가 결과객체를 반환하지 않아서..
                res.status(200).json({
                    refNum : refNum,
                    ingerOrnu : ingrOrnu,
                    ingrName : ingrName || refEIInfo.IngrName, 
                    enrollDate : refEIInfo.enrollDate,
                    expyDate : expyDate || refEIInfo.expyDate, 
                    quantity : quantity || refEIInfo.quantity, 
                    storageMthdType : storageMthdType || refEIInfo.storageMthdType, 
                    presetIngrNum : presetIngrNum || refEIInfo.presetIngrNum
                })
            }).catch((err) => {
            
                console.log(err)
                if (err.name == 'SequelizeValidationError') 
                    res.status(400).json({message : "TYPE must be in ('f', 'r', 'a')"}) 
                else if(err.name == 'SequelizeForeignKeyConstraintError')
                    res.status(404).json({ message: "Ref or PresetIngr Not Found" })
                else res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }

    static async deleteRefEI(req, res) {
        const { refNum, ingrOrnu } = req.query;

        const refEIInfo = await RefEI.findOne({where : {refNum : refNum, ingrOrnu : ingrOrnu}})
        
        if(!refEIInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            RefEI.destroy({ 
                where : {refNum : refNum, ingrOrnu : ingrOrnu}
            }).then((result) => {
                res.status(200).json()
            }).catch((err) => {
                res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }
}