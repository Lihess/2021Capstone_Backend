// 21.05.30 이은비
// 냉장고(ref) 모델
const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    // 속성 정의
    static init(sequelize) {
        return super.init({
            refNum : {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                unique: true,
                primaryKey : true
            },
            refName : {
                type : Sequelize.STRING(30),
                allowNull : false
            },
            explan : {
                type : Sequelize.STRING(300),
                allowNull : true
            },
            colorCode : {
                type : Sequelize.CHAR(7),
                allowNull : false,
                defaultValue : '#B0D8E7'
            },
            refType : {
                // 'h : 가정용 냉장고(기본), k : 김치 냉장고, v : 음료 냉장고, f : 냉동고, r : 냉장고' 내에서 만
                type : Sequelize.ENUM('h', 'k', 'v', 'f', 'r'),
                validate: {
                    isIn : {
                        args: [['h', 'k', 'v', 'f', 'r']],
                    }
                },
                allowNull : false,
                defaultValue : 'h'
            }   
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Ref',
            tableName: 'ref',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // 관계 정의
    static associate(db) {
        // 관계 중 자신이 부모인
        this.hasMany(db.RefEnrollIngr, {
            as : 'enrollIngrs',
            foreignKey : {
                name : 'refNum',
                primaryKey : true,
                allowNull : false
            },
            sourceKey : 'refNum'
        });
        // 관계 중 자신이 자식인
        this.belongsTo(db.User, {
            foreignKey : {
                name : 'ownerNum',
                allowNull : false,
            },
            targetKey : 'userNum'
        });
    }
}