// 21.05.26 이은비
// 사용자(User) 모델
const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    // 속성 정의
    static init(sequelize) {
        return super.init({
            userNum:{
                type: Sequelize.CHAR(10),
                allowNull: false,
                unique: true,
                primaryKey : true
            },
            id : {
                type : Sequelize.STRING(15),
                allowNull: false
            },
            pwd :{
                type : Sequelize.STRING(15),
                allowNull: false,
            },
            nickname : {
                type : Sequelize.STRING(15),
                allowNull: false
            },
            email :{
                type : Sequelize.STRING(15),
                allowNull: false
            },
            linkId :{
                type : Sequelize.STRING(30),
                allowNull: true
            }
        },{
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'User',
            tableName: 'user',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // 관계 정의
    static associate(db) {
        this.hasMany(db.Order, {
            foreignKey : {
                name : 'ordererNum',
                primaryKey : true,
                allowNull : false
            },
            sourceKey : 'userNum',
        });
        this.hasMany(db.Ref, {
            foreignKey : {
                name : 'ownerNum',
                allowNull : false,
            },
            sourceKey : 'userNum'
        })
    }
} 