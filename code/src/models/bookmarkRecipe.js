// 21.09.18 이은비
// 즐겨찾기 레시피(BookmarkRecipe) 모델
const Sequelize = require('sequelize');

module.exports = class BookmarkRecipe extends Sequelize.Model {
    // 속성 정의
    static init(sequelize) {
        return super.init({
            bookmarkOrnu :{
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey : true
            }
        },{
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'BookmarkRecipe',
            tableName: 'Bookmark_recipe',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // 관계 정의
    static associate(db) {
        this.belongsTo(db.Recipe, {
            as : 'recipe',
            foreignKey : {
                name : 'recipeNum',
                primaryKey : true,
                allowNull : false
            },
            targetKey : 'recipeNum'
        });
        this.belongsTo(db.User, {
            foreignKey : {
                name : 'userNum',
                primaryKey : true,
                allowNull : false
            },
            targetKey : 'userNum'
        });
    }
} 