// 21.09.25 이은비
// IIR에 대한 데이터 처리부분
const { Recipe, RefEnrollIngr, sequelize } = require('../models')
const IIR = require('../models/imnIngrRecipe')

module.exports = class ImnIngrRecipeController {
    static async createIIR(req, res){
        const { refNum, ingrOrnu, recipeNum } = req.body

        const countOrnu = await IIR.count({ where : {refNum : refNum, ingrOrnu : ingrOrnu} })

        IIR.create({
            refNum, ingrOrnu, recipeOrnu : countOrnu + 1, recipeNum
        }).then((result)=> {
            res.status(200).json({
                refNum : result.refNum, 
                ingrOrnu : result.ingrOrnu, 
                recipeOrnu : result.recipeOrnu,
                recipeNum : result.recipeNum
            })
        }).catch((err) => {
            console.log(err)
            if(err.name == 'SequelizeForeignKeyConstraintError')
                res.status(404).json({ message: "EnrollIngr or Recipe Not Found" })
            else res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async readIIR(req, res) {
        const {  refNum, ingrOrnu, recipeOrnu  } = req.query;

        IIR.findOne({
                where : {  refNum : refNum, ingrOrnu : ingrOrnu, recipeOrnu : recipeOrnu },
                include: [
                    { model : Recipe, attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}},
                    { model : RefEnrollIngr, attributes: {exclude: [ 'refNum', 'ingrOrnu', 'createdAt', 'updatedAt', 'deletedAt']}}
                ], 
                attributes: {exclude: [ 'recipeNum','createdAt', 'updatedAt', 'deletedAt']}
            }
        ).then((result) => {
            result == null 
                ? res.status(404).json({ message: "Not Found" }) : res.status(200).json(result)
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async updateIIR(req, res) {
        const { refNum, ingrOrnu, recipeOrnu, recipeNum } = req.body

        const IIRInfo = await IIR.findOne({ where : { refNum : refNum, ingrOrnu : ingrOrnu, recipeOrnu : recipeOrnu }})
        
        if(!IIRInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            IIR.update({
                recipeNum : recipeNum || IIRInfo.recipeNum
            }, { 
                where : { refNum : refNum, ingrOrnu : ingrOrnu, recipeOrnu : recipeOrnu }
            }).then((result) => {
                // result가 결과객체를 반환하지 않아서..
                res.status(200).json({
                    refNum : refNum, 
                    ingrOrnu : ingrOrnu, 
                    recipeOrnu : recipeOrnu, 
                    recipeNum : recipeNum || IIRInfo.recipeNum
                })
            }).catch((err) => {
                if(err.name == 'SequelizeForeignKeyConstraintError')
                    res.status(404).json({ message: "EnrollIngr or Recipe Not Found" })
                else res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }

    static async deleteIIR(req, res) {
        const {  refNum, ingrOrnu, recipeOrnu  } = req.query;

        const IIRInfo = await IIR.findOne({ where : { refNum : refNum, ingrOrnu : ingrOrnu, recipeOrnu : recipeOrnu }})
        
        if(!IIRInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            IIR.destroy({ 
                where : { refNum : refNum, ingrOrnu : ingrOrnu, recipeOrnu : recipeOrnu }
            }).then((result) => {
                res.status(200).json()
            }).catch((err) => {
                res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }

    static async readIIRByUser(req, res){
        const { userNum } = req.params
       
        IIR.findAll({
            where : {
                refNum : [sequelize.literal(`SELECT ref_num FROM ref WHERE owner_num=${userNum}`)]
            },
            order : [['refNum', 'ASC'], ['ingrOrnu', 'ASC']],
            include: [
                { model : Recipe, attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}},
                { model : RefEnrollIngr, attributes: {exclude: [ 'refNum', 'ingrOrnu', 'createdAt', 'updatedAt', 'deletedAt']}}
            ],
            attributes: {exclude: [ 'recipeNum','createdAt', 'updatedAt', 'deletedAt']}
        }).then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json({ message: "Internal Server Error" });
        })
    }
}
