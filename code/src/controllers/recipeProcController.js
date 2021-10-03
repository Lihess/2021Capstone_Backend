// 21.10.03 이은비
// RecipeProc에 대한 데이터 처리부분
const { Sequelize } = require('../models');
const RecipeProc = require('../models/recipeProc')

module.exports = class RecipeProcController {
    static async createRecipeProc(req, res){
        const { recipeNum, explan, picPath } = req.body;

        const { lastOrnu } = await RecipeProc.count({
                                where : {recipeNum : recipeNum},
                                attributes : [[Sequelize.fn('max', Sequelize.col('proc_ornu')), 'lastOrnu']],
                                raw: true
                            }).catch((err) => { 
                                res.status(404).json({ message: "Recipe Not Found" }) 
                            })

        RecipeProc.create({
            recipeNum, procOrnu : lastOrnu + 1,  explan, picPath
        }).then((result) => {
            res.status(200).json({
                recipeNum : result.recipeNum, 
                procOrnu : result.procOrnu,
                explan : result.explan, 
                picPath : result.picPath
            })
        }).catch((err) => {
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async readRecipeProc(req, res) {
        const { recipeNum, procOrnu } = req.query;

        RecipeProc.findOne({
            where : { recipeNum : recipeNum, procOrnu : procOrnu },
            attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}
        }).then((result) => {
            result == null 
                ? res.status(404).json({ message: "Not Found" }) : res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async updateRecipeProc(req, res) {
        const { recipeNum, procOrnu, explan, picPath } = req.body;
        
        // 해당 recipeProc가 존재하는지 알기 위해.
        const procInfo = await RecipeProc.findOne({where : { recipeNum : recipeNum, procOrnu : procOrnu }})
        
        if(!procInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            RecipeProc.update({
                    explan : explan || procInfo.explan, 
                    picPath : picPath || procInfo.picPath
                }, { 
                    where : { recipeNum : recipeNum, procOrnu : procOrnu }
                }) .then((result) => {
                    // result가 결과객채를 반환하지 않아서..
                    res.status(200).json({
                        recipeNum : recipeNum,
                        procOrnu : procOrnu,
                        explan : explan || procInfo.explan, 
                        picPath : picPath || procInfo.picPath
                    })
            }).catch((err) => {
                res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }

    static async deleteRecipeProc(req, res) {
        const { recipeNum, procOrnu } = req.query;

        // 해당 recipeProc가 존재하는지 알기 위해.
        const procInfo = await RecipeProc.findOne({where : { recipeNum : recipeNum, procOrnu : procOrnu }})
        
        if(!procInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            RecipeProc.destroy({
                where : { recipeNum : recipeNum, procOrnu : procOrnu }
            }).then((result) => {
                res.status(200).json()
            }).catch((err) => {
                res.status(500).json({ message: "Internal Server Error" });
            })

        }
    }
}