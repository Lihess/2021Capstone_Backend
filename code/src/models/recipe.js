// 21.05.26 이은비
// 레시피(recipe) 모델
const Sequelize = require('sequelize');

module.exports = class Recipe extends Sequelize.Model {
    // 속성 정의
    static init(sequelize) {
        return super.init({
            recipeNum :{
                type: Sequelize.CHAR(10),
                allowNull: false,
                unique: true,
                primaryKey : true
            },
            title : {
                type : Sequelize.STRING(30),
                allowNull : false
            },
            reqTime : {
                type : Sequelize.TIME,
                allowNull : false
            },
            serve : {
                type : Sequelize.DECIMAL(3, 1),
                allowNull : false,
                defaultValue : 1
            }
        },{
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Recipe',
            tableName: 'recipe',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // 관계 정의
    static associate(db) {
        this.hasMany(db.ImnIngrRecipe, {
            foreignKey : {
                name : 'recipeNum',
                allowNull : false
            },
            sourceKey : 'recipeNum'
        });
        this.hasMany(db.RecipeIngr, {
            foreignKey : {
                name : 'recipeNum',
                primaryKey : true,
                allowNull : false
            },
            sourceKey : 'recipeNum'
        });
        this.hasMany(db.RecipeProc, {
            foreignKey : {
                name : 'recipeNum',
                primaryKey : true,
                allowNull : false
            },
            sourceKey : 'recipeNum'
        });
    }
} 