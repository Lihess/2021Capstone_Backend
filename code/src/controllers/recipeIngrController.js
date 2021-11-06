// 21.10.03 이은비
// Recipeingr에 대한 데이터 처리부분
const { Sequelize } = require('../models');
const RecipeIngr = require('../models/recipeIngr')

module.exports = class RecipeIngrController {
    static async createRecipeIngr(req, res){
        const { recipeNum, ingrName, quantityUnit } = req.body;
        //console.log(recipeNum, ingrName, quantityUnit)

        const { lastOrnu } = await RecipeIngr.findOne({
                                    where : {recipeNum : recipeNum},
                                    attributes : [[Sequelize.fn('max', Sequelize.col('ingr_ornu')), 'lastOrnu']],
                                    raw: true
                                }).catch((err) => { 
                                    res.status(404).json({ message: "Recipe Not Found" }) 
                                })
        
        RecipeIngr.create({
            recipeNum, ingrOrnu : lastOrnu + 1, ingrName, quantityUnit
        }).then((result) => {
            res.status(200).json({
                recipeNum : result.recipeNum, 
                ingrOrnu : result.ingrOrnu,
                ingrName : result.ingrName, 
                quantityUnit : result.quantityUnit
            })
        }).catch((err) => {
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async readRecipeIngr(req, res) {
        const { recipeNum, ingrOrnu } = req.query;

        RecipeIngr.findOne({
            where : { recipeNum : recipeNum, ingrOrnu : ingrOrnu },
            attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}
        }).then((result) => {
            result == null 
                ? res.status(404).json({ message: "Not Found" }) : res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async updateRecipeIngr(req, res) {
        const { recipeNum, ingrOrnu, ingrName, quantityUnit } = req.body;
        
        // 해당 recipeingr가 존재하는지 알기 위해.
        const ingrInfo = await RecipeIngr.findOne({where : { recipeNum : recipeNum, ingrOrnu : ingrOrnu }})
        
        if(!ingrInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            RecipeIngr.update({
                    ingrName : ingrName || ingrInfo.ingrName, 
                    quantityUnit : quantityUnit || ingrInfo.quantityUnit
                }, { 
                    where : { recipeNum : recipeNum, ingrOrnu : ingrOrnu }
                }) .then((result) => {
                    // result가 결과객채를 반환하지 않아서..
                    res.status(200).json({
                        recipeNum : recipeNum,
                        ingrOrnu : ingrOrnu,
                        ingrName : ingrName || ingrInfo.ingrName, 
                        quantityUnit : quantityUnit || ingrInfo.quantityUnit
                    })
            }).catch((err) => {
                res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }

    static async deleteRecipeIngr(req, res) {
        const { recipeNum, ingrOrnu } = req.query;

        // 해당 recipeingr가 존재하는지 알기 위해.
        const ingrInfo = await RecipeIngr.findOne({where : { recipeNum : recipeNum, ingrOrnu : ingrOrnu }})
        
        if(!ingrInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            RecipeIngr.destroy({
                where : { recipeNum : recipeNum, ingrOrnu : ingrOrnu }
            }).then((result) => {
                res.status(200).json()
            }).catch((err) => {
                res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }
}