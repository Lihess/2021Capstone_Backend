// 21.09.25 이은비
// IIR에 대한 데이터 처리부분
const { Recipe, RefEnrollIngr, sequelize } = require('../models')
const IIR = require('../models/imnIngrRecipe')

const schedule = require('node-schedule')
const Sequelize = require('sequelize')
module.exports = class ImnIngrRecipeController {
    static async createIIR(req, res){
        const { refNum, ingrOrnu, recipeNum } = req.body

        const { lastOrnu } = await IIR.findOne({ 
                                where : { refNum : refNum, ingrOrnu : ingrOrnu},
                                attributes : [[Sequelize.fn('max', Sequelize.col('recipe_ornu')), 'lastOrnu']],
                                raw: true
                            })

        IIR.create({
            refNum, ingrOrnu, recipeOrnu : lastOrnu + 1, recipeNum
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
                    { model : Recipe, attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}, as : "recipe"},
                    { model : RefEnrollIngr, attributes: {exclude: [ 'refNum', 'ingrOrnu', 'createdAt', 'updatedAt', 'deletedAt']}, as : "refEnrollIngr"}
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
                    res.status(404).json({ message: "Recipe Not Found" })
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

    // 사용자의 모든 임박 식자재와 그에 대한 레시피 read
    static async readIIRsByUser(req, res){
        const { userNum } = req.params
        
        IIR.findAll({
            where : {
                refNum : [sequelize.literal(`SELECT ref_num FROM ref WHERE owner_num=${userNum}`)]
            },
            order : [['refNum', 'ASC'], ['ingrOrnu', 'ASC']],
            include: [
                { model : Recipe, attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}, as : 'recipe'},
                { model : RefEnrollIngr, attributes: {exclude: [ 'refNum', 'ingrOrnu', 'createdAt', 'updatedAt', 'deletedAt']}, as : 'refEnrollIngr'}
            ],
            attributes: {exclude: [ 'recipeNum','createdAt', 'updatedAt', 'deletedAt']}
        }).then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    // 사용자의 모든 임박 식자재 read
    static async readImnIngrsByUser(req, res){
        const { userNum } = req.params
       
        IIR.findAll({
            where : {
                refNum : [sequelize.literal(`SELECT ref_num FROM ref WHERE owner_num=${userNum}`)]
            },
            order : [['refNum', 'ASC'], ['ingrOrnu', 'ASC']],
            include: [{ model : RefEnrollIngr, attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}, as : 'refEnrollIngr'}],
            attributes: {exclude: ['recipeNum','createdAt', 'updatedAt', 'deletedAt']},
            // 그룹화를 통해 동일한 식자재는 한번만 호출되도록.
            group : ['refNum', 'ingrOrnu']
        }).then((result) => {
            // 응답 데이터 형식을 맞추기 위해서.
            const ingrList = { imnIngrs : result.map((r) => r.refEnrollIngr) }
            res.status(200).json(ingrList)
        }).catch((err) => {
            res.status(500).json({ message: "Internal Server Error" });
        })
    }



}

// 스케줄러, 매일 정각 사용기간이 3일 남은 식자재를 엔터티로 사용.
//const createIIRS = schedule.scheduleJob('0 0 0 1/1 * ? * ', async() => {
//    // 남은 사용기간이 3일인 식자재와 그 식자재를 사용하는 레시피를 검색하는 쿼리.
//    // rowNum을 이용하여 recipeOrnu를 일정하게 부여
//    const query = `
//        select @rowNum := @rowNum+1 as recipeOrnu, y.ref_num as refNum, y.ingr_ornu as ingrOrnu, x.recipe_num as recipeNum 
//        from recipe_ingr as x, ref_enroll_ingr as y, (SELECT @rowNum:=0) R
//        where (x.ingr_name = y.ingr_name) and datediff(y.expy_date, now()) = 3;
//    `
//    sequelize.query(query, { type : Sequelize.QueryTypes.SELECT }) // type : 중복 방식을 위해서
//            .then((list) => {
//                // IIR 대량 생성
//                IIR.bulkCreate(list)
//                    .then((result) => { console.log( result.length, "IIR Bluk Create Success ") })
//                    .catch((err) => { console.log("error : ", err) })
//            }).catch((err) => {  console.log("error : ", err) })
//})
