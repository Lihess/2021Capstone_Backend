// 21.05.30 이은비
// 임박식자재레시피(ImnIngrRecipe) 모델
const Sequelize = require('sequelize');

module.exports = class ImnIngrRecipe extends Sequelize.Model {
    // 속성 정의
    static init(sequelize) {
        return super.init({
            recipeOrnu :{
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey : true
            },
            refNum : { // sequlize가 복합 외래키를 지원하지 않아서 따로 속성으로 정의
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey : true
            }
        },{
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'ImnIngrRecipe',
            tableName: 'imn_ingr_recipe',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // 관계 정의
    static associate(db) {
        this.belongsTo(db.RefEnrollIngr, {
            as : 'refEnrollIngr',
            foreignKey : {
                name : 'ingrOrnu',
                primaryKey : true,
                allowNull : false
            },
            targetKey : 'ingrOrnu'
        });
       
        this.belongsTo(db.Recipe, {
            as : 'recipe',
            foreignKey : {
                name : 'recipeNum',
                allowNull : false
            },
            targetKey : 'recipeNum'
        });
    }
} 