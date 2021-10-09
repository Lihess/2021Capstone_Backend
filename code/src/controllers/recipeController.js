const Recipe = require('../models/recipe')
const { Op, Sequelize } = require("sequelize");
const { nowDate } = require('../utils/date');

module.exports = class RecipeController {

  //create 작성
  static async createRecipe(req, res){
        const {title, reqTime, serve, picPath} = req.body

        // 식별자 지정 : yymmdd0000
        const { lastNum } = await Recipe.findOne({ 
			where : { recipeNum  : {[Op.like] : `${nowDate()}%` }},
			attributes : [[Sequelize.fn('max', Sequelize.col('recipe_num')), 'lastNum']],
			raw: true
		})
		// 해당 날짜에 생성된 엔터티가 없다면 날짜+0001, 있다면 +1
		const recipeNum = lastNum == null ? nowDate() + '0001' : lastNum + 1

        Recipe.create({
            recipeNum, title, reqTime, serve, picPath
        }).then((result)=>{
            res.status(200).json({
                recipeNum : result.recipeNum,
                title : result.title,
                reqTime : result.reqTime,
                picPath : result.picPath,
                serve : result.serve
            })
        }).catch((err) => {
            //console.log(err)
            res.status(500).json({message : "Internal Server Error"});
        })
  }

    //read 작성
    static async readRecipe(req, res){
        const {recipeNum} = req.params;

        Recipe.findByPk(
            recipeNum, {attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']}}
        ).then((result) => {
            result == null
                ? res.status(404).json({ message: "Not Found"}) : res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json({message: "Internal Server Error"});
        })
    }

    //update 작성
    static async updateRecipe(req, res){
        const{recipeNum,title,reqTime,serve,picPath} = req.body

        const recipeInfo = await Recipe.findByPk(recipeNum)

        if(!recipeInfo){
            res.status(404).json({ message : "Not Found"})
        } else {
            Recipe.update({
                title : title || recipeInfo.title,
                reqTime : reqTime || recipeInfo.reqTime,
                serve : serve || recipeInfo.serve,
                // 선택 속성에서 문자열 null로 요청이 들어올 경우 값을 null 설정
                picPath : picPath == "null" ? null : picPath || recipeInfo.picPath
            }, {
                where : {recipeNum : recipeNum}
            }).then((result) => {
                // result가 결과객체를 반환하지 않는다?
                res.status(200).json({
                    recipeNum : recipeNum,
                    title : title || recipeInfo.title,
                    reqTime : reqTime || recipeInfo.reqTime,
                    serve : serve || recipeInfo.serve,
                    picPath : picPath == "null" ? null : picPath || recipeInfo.picPath
                })
            }).catch((err) => {
                res.status(500).json({message : "Internal Server Error"});
            })
        }
    }

    static async deleteRecipe(req, res){
        const { recipeNum } = req.params;

        const recipeInfo = await Recipe.findByPk(recipeNum)

        if(!recipeInfo){
            res.status(404).json({ message: "Not Found"})
        } else {
            Recipe.destroy({
                where : {recipeNum : recipeNum}
            }).then((result) => {
                res.status(200).json()
            }).catch((err) => {
                res.status(500).json({ message : "Internal Server Error "});
            })
      }
    }
}