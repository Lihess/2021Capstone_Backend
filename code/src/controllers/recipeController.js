const Recipe = require('../models/recipe')

module.exports = class RecipeController {

  //create 작성
  static async createRecipe(req, res){
    const {title, reqTime, serve, picPath} = req.body

    Recipe.create({
      title, reqTime, serve, picPath
    }).then((result)=>{
      res.status(200).json({
        recipeNum : result.recipeNum,
        title : result.title,
        reqTime : result.reqTime,
        picPath : result.picPath,
        serve : result.serve
      })
    }).catch((err) => {console.log(err)
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
        picPath : picPath || recipeInfo.picPath
      }, {
        where : {recipeNum : recipeNum}
      }).then((result) => {
        // result가 결과객체를 반환하지 않는다?
        res.status(200).json({
          recipeNum : recipeNum,
          title : title || recipeInfo.title,
          reqTime : reqTime || recipeInfo.reqTime,
          serve : serve || recipeInfo.serve,
          picPath : picPath || recipeInfo.picPath
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