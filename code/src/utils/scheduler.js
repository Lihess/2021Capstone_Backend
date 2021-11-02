const { sequelize } = require('../models')
const Sequelize = require('sequelize')
const IIR = require('../models/imnIngrRecipe')

// 스케줄러, 매일 정각 사용기간이 3일 남은 식자재를 엔터티로 사용.
const createIIRS = () => {
    // 남은 사용기간이 3일인 식자재와 그 식자재를 사용하는 레시피를 검색하는 쿼리.
    // rowNum을 이용하여 recipeOrnu를 일정하게 부여
    const query = `
        SELECT (CASE @GROUPING WHEN ingrOrnu+refNum THEN @RANK := @RANK + 1 ELSE @RANK := 1 END) AS recipeOrnu, (@GROUPING:=ingrOrnu+refNum),
        refNum, ingrOrnu, recipeNum
        FROM (select x.recipe_num as recipeNum, y.ingr_ornu as ingrOrnu,  y.ref_num as refNum
	        from recipe_ingr as x, ref_enroll_ingr as y
	        where (x.ingr_name = y.ingr_name) and datediff(y.expy_date, DATE_ADD(now(), INTERVAL 9 HOUR)) = 3
	        order by y.ref_num, y.ingr_ornu) temp, (SELECT @GROUPING := '', @RANK := 0) R;
    `
    sequelize.query(query, { type : Sequelize.QueryTypes.SELECT }) // type : 중복 방식을 위해서
            .then((list) => {
                // IIR 대량 생성
                IIR.bulkCreate(list)
                    .then((result) => { console.log( result.length, "IIR Bluk Create Success ") })
                    .catch((err) => { console.log("error : ", err) })
            }).catch((err) => {  console.log("error : ", err) })
}

module.exports = createIIRS;

//createIIRS();