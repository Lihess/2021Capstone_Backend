const PresetIngr = require('../models/PresetIngr')

module.exports = class PresetIngrController {

  //create 작성
  static async createPresetIngr(req, res){
    const {presetIngrName, expydate, ingrType,} = req.body

    PresetIngr.create({
      presetIngrName, expydate, ingrType,
    }).then((result)=>{
      res.status(200).json({
        presetIngrNum : result.presetIngrNum,
        presetIngrName : result.presetIngrName,
        expydate  : result.expydate, 
        ingrType : result.ingrType
      })
    }).catch((err) => {console.log(err)
      if (err.name == 'SequelizeValidationError')
      res.status(400).json({message : "TYPE must be in ('g', 'v', 'f', 'm', 'a', 's', 'c', 'd', 'b', 'e')"})
      else res.status(500).json({message : "Internal ingrTyper Error"});
    })
  }

  //read 작성
  static async readPresetIngr(req, res){
    const {presetIngrNum} = req.params;

    PresetIngr.findByPk(
      presetIngrNum, {attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']}}
    ).then((result) => {
      result == null
        ? res.status(404).json({ message: "Not Found"}) : res.status(200).json(result)
    }).catch((err) => {
      res.status(500).json({message: "Internal Server Error"});
    })
  }

  //update 작성
  static async updatePresetIngr(req, res){
    const{presetIngrNum,presetIngrName,expydate, ingrType} = req.body
    
    const presetIngrInfo = await PresetIngr.findByPk(presetIngrNum)

    if(!presetIngrInfo){
      res.status(404).json({ message : "Not Found"})
    } else {
      PresetIngr.update({
        // || : null이면 뒤의 값을 넣고 아니면 앞의 값을 넣는다
        presetIngrName : presetIngrName || presetIngrInfo.presetIngrName,
        expydate  : expydate  || presetIngrInfo.expydate, 
        ingrType : ingrType || presetIngrInfo.ingrType,
      }, {
        where : {presetIngrNum : presetIngrNum}
      }).then((result) => {
        // result가 결과객체를 반환하지 않는다?
        res.status(200).json({
          presetIngrNum : presetIngrNum,
          presetIngrName : presetIngrName || presetIngrInfo.presetIngrName,
          expydate  : expydate  || presetIngrInfo.expydate, 
          ingrType : ingrType || presetIngrInfo.ingrType,
        })
      }).catch((err) => {
         res.status(500).json({message : "Internal ingrTyper Error"});
      })
    }
  }
  static async deletePresetIngr(req, res){
    const { presetIngrNum } = req.params;

    const presetIngrInfo = await PresetIngr.findByPk(presetIngrNum)

    if(!presetIngrInfo){
      res.status(404).json({ message: "Not Found"})
    } else {
      PresetIngr.destroy({
        where : {presetIngrNum : presetIngrNum}
      }).then((result) => {
        res.status(200).json()
      }).catch((err) => {
        res.status(500).json({ message : "Internal ingrTyper Error "});
      })
    }
  }
}