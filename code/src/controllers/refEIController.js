// 21.09.25 이은비
// RefEnrollIngr에 대한 데이터 처리부분
const { sequelize, ImnIngrRecipe } = require('../models');
const Sequelize = require('sequelize')
const RefEI = require('../models/refEnrollIngr');

module.exports = class RefEIController {
    static async createRefEI(req, res){
        const {refNum, ingrName, expyDate, quantity, storageMthdType, presetIngrNum} = req.body
        
        const { lastOrnu } = await RefEI.findOne({
                                where : {refNum : refNum},
                                attributes : [[Sequelize.fn('max', Sequelize.col('ingr_ornu')), 'lastOrnu']],
                                raw: true
                            })
        
        RefEI.create({
            refNum, ingrOrnu : lastOrnu + 1, ingrName, expyDate, enrollDate : new Date().toLocaleDateString('ko-KR'), quantity, storageMthdType, presetIngrNum
        }).then((result)=> {
            res.status(200).json({
                refNum : result.refNum, 
                ingrOrnu : result.ingrOrnu,
                ingrName : result.ingrName, 
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

        afterExpyInput('create', expyDate, refNum, lastOrnu + 1, ingrName)
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
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async updateRefEI(req, res) {
        const {refNum, ingrOrnu, ingrName, expyDate, quantity, storageMthdType, presetIngrNum} = req.body

        const refEIInfo = await RefEI.findOne({where : {refNum : refNum, ingrOrnu : ingrOrnu}})
        console.log(refEIInfo.ingrName)
        if(!refEIInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            RefEI.update({
                ingrName : ingrName || refEIInfo.ingrName, 
                expyDate : expyDate || refEIInfo.expyDate, 
                quantity : quantity || refEIInfo.quantity, 
                storageMthdType : storageMthdType || refEIInfo.storageMthdType, 
                // 선택 속성에서 문자열 null로 요청이 들어올 경우 값을 null 설정
                presetIngrNum : presetIngrNum == "null" ? null : presetIngrNum || refEIInfo.presetIngrNum
            }, { 
                where : {refNum : refNum, ingrOrnu : ingrOrnu}
            }).then((result) => {
                // result가 결과객체를 반환하지 않아서..
                res.status(200).json({
                    refNum : refNum,
                    ingrOrnu : ingrOrnu,
                    ingrName : ingrName || refEIInfo.ingrName, 
                    enrollDate : refEIInfo.enrollDate,
                    expyDate : expyDate || refEIInfo.expyDate, 
                    quantity : quantity || refEIInfo.quantity, 
                    storageMthdType : storageMthdType || refEIInfo.storageMthdType, 
                    presetIngrNum : presetIngrNum == "null" ? null : presetIngrNum || refEIInfo.presetIngrNum
                })
            }).catch((err) => {
                if (err.name == 'SequelizeValidationError') 
                    res.status(400).json({message : "TYPE must be in ('f', 'r', 'a')"}) 
                else res.status(500).json({ message: "Internal Server Error" });
            })
        }

        //const updateName = ingrName ? ingrName : refEIInfo.IngrName
        expyDate ? afterUpdateExpy('update', expyDate, refNum, ingrOrnu, ingrName || refEIInfo.ingrName) : null
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

    // 해당 냉장고에서 특정 보관방법을 가진 모든 식자재 리스트 읽기 API 
    static async readRefEIsByType(req, res){
        const { refNum, type } = req.query;

        RefEI.findAll({
            where : { refNum : refNum, storageMthdType : type },
            order : [['ingrOrnu', 'ASC']],
            attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}
        }).then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            if(err.name == 'SequelizeForeignKeyConstraintError')
                res.status(404).json({ message: "Ref Not Found" })
            else res.status(500).json({ message: "Internal Server Error" });
        })
    }
}

// 등록 식자재의 수정 후 삭제제
const afterExpyInput = (mthd, expyDate, refNum, ingrOrnu, ingrName) => {
    console.log(mthd, expyDate, refNum, ingrOrnu, ingrName)
    const toDate = Date.parse(new Date().toLocaleDateString('ko-KR'))
    const dateDiff = (new Date(expyDate) - toDate) / (1000*60*60*24) 
    
    // 날짜 차이가 3일 초과인 경우, update
    // 해당 식자재와 관련된 임박 식자재 레시피 삭제
    if((mthd == 'update') && (dateDiff > 3)) {
        ImnIngrRecipe.destroy({
            where : {refNum : refNum, ingrOrnu : ingrOrnu}
        })
    } 
    // 날짜 차이가 3일 이하인 경우
    // 해당 식자재와 관련된 임박 식자재 레시피 등록
    else if(dateDiff <= 3) {
        const query = `
            select @rowNum := @rowNum+1 as recipeOrnu, ${refNum} as refNum, 
                    ${ingrOrnu} as ingrOrnu, x.recipe_num as recipeNum 
            from recipe_ingr as x, ref_enroll_ingr as y, (SELECT @rowNum:=0) R
            where x.ingr_name = '${ingrName}'
            group by x.recipe_num;
        `

        sequelize.query(query, { type : Sequelize.QueryTypes.SELECT }) // type : 중복 방식을 위해서
            .then((list) => {
                // IIR 대량 생성
                ImnIngrRecipe.bulkCreate(list)
                    .then((result) => { console.log( result.length, "IIR Bluk Create Success ") })
                    .catch((err) => { console.log("error : ", err) })
            }).catch((err) => {  console.log("error : ", err) })
    }
}