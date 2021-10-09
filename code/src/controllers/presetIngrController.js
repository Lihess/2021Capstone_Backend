const PresetIngr = require('../models/presetIngr')
const { Op, Sequelize } = require("sequelize");
const { nowDate } = require('../utils/date');

module.exports = class PresetIngrController {

  	//create 작성
  	static async createPresetIngr(req, res){
  	 	const { presetIngrName, shelfLife, ingrType } = req.body

        // 식별자 지정 : yymmdd0000
        const { lastNum } = await PresetIngr.findOne({ 
			where : { presetIngrNum  : {[Op.like] : `${nowDate()}%` }},
			attributes : [[Sequelize.fn('max', Sequelize.col('preset_ingr_num')), 'lastNum']],
			raw: true
		})
		// 해당 날짜에 생성된 엔터티가 없다면 날짜+0001, 있다면 +1
		const presetIngrNum = lastNum == null ? nowDate() + '0001' : lastNum + 1
		
		PresetIngr.create({
			presetIngrNum, presetIngrName, shelfLife, ingrType 
		}).then((result) => {
			res.status(200).json({
			      presetIngrNum : result.presetIngrNum,
			      presetIngrName : result.presetIngrName,
			      shelfLife  : result.shelfLife, 
			      ingrType : result.ingrType
			    })
		}).catch((err) => {
			//console.log(err)
			if (err.name == 'SequelizeValidationError') 
                res.status(400).json({message : "TYPE must be in ('g', 'v', 'f', 'm', 'a', 's', 'c', 'd', 'b', 'e')"}) 
            else res.status(500).json({message : "Internal ingrTyper Error"});
		})
  	}

  	//read 작성
  	static async readPresetIngr(req, res){
  	  	const { presetIngrNum } = req.params;

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
  	  	const{ presetIngrNum, presetIngrName, shelfLife, ingrType } = req.body
	
  	 	const presetIngrInfo = await PresetIngr.findByPk(presetIngrNum)

  	  	if(!presetIngrInfo){
  	    	res.status(404).json({ message : "Not Found"})
  	  	} else {
  	    	PresetIngr.update({
  	      		// || : null이면 뒤의 값을 넣고 아니면 앞의 값을 넣는다
  	      		presetIngrName : presetIngrName || presetIngrInfo.presetIngrName,
  	      		shelfLife  : shelfLife  || presetIngrInfo.shelfLife, 
  	      		ingrType : ingrType || presetIngrInfo.ingrType,
  	   		}, {
  	      		where : {presetIngrNum : presetIngrNum}
  	    	}).then((result) => {
  	      		// result가 결과객체를 반환하지 않아서
  	      		res.status(200).json({
  	      			presetIngrNum : presetIngrNum,
  	      			presetIngrName : presetIngrName || presetIngrInfo.presetIngrName,
					shelfLife  : shelfLife  || presetIngrInfo.shelfLife, 
  	      			ingrType : ingrType || presetIngrInfo.ingrType,
  	      		})
  	    	}).catch((err) => {
  	      		if (err.name == 'SequelizeValidationError') 
                	res.status(400).json({message : "TYPE must be in ('g', 'v', 'f', 'm', 'a', 's', 'c', 'd', 'b', 'e')"}) 
            	else res.status(500).json({message : "Internal ingrTyper Error"});
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