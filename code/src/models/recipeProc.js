// 21.05.26 이은비
// 레시피과정(recipeProc) 모델
const Sequelize = require('sequelize');

module.exports = class RecipeProc extends Sequelize.Model {
    // 속성 정의
    static init(sequelize) {
        return super.init({
            procOrnu :{
                type: Sequelize.CHAR(3),
                allowNull: false,
                primaryKey : true
            },
            explan : {
                type : Sequelize.STRING(300),
                allowNull : false
            },
            picPath : {
                type : Sequelize.STRING(300),
                allowNull : true
            },
        },{
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'RecipeProc',
            tableName: 'recipe_proc',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // 관계 정의
    static associate(db) {
        this.belongsTo(db.Recipe, {
            foreignKey : {
                name : 'recipeNum',
                primaryKey : true,
                allowNull : false
            },
            targetKey : 'recipeNum'
        })
    }
} 