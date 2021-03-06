// 21.05.30 이은비
// 레시피식자재(recipeIngr) 모델
const Sequelize = require('sequelize');

module.exports = class RecipeIngr extends Sequelize.Model {
    // 속성 정의
    static init(sequelize) {
        return super.init({
            ingrOrnu :{
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey : true
            },
            ingrName : {
                type : Sequelize.STRING(30),
                allowNull : false
            },
            quantityUnit : {
                type : Sequelize.STRING(10),
                allowNull : false
            }
        },{
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'RecipeIngr',
            tableName: 'recipe_ingr',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // 관계 정의
    static associate(db) {
        this.belongsTo(db.Recipe, {
            as : 'recipeIngrs',
            foreignKey : {
                name : 'recipeNum',
                primaryKey : true,
                allowNull : false
            },
            targetKey : 'recipeNum'
        });
    }
} 