// 21.05.30 이은비
// 냉장고등록식자재(refEnrollIngr) 모델
const Sequelize = require('sequelize');

module.exports = class RefEnrollIngr extends Sequelize.Model {
    // 속성 정의
    static init(sequelize) {
        return super.init({
            ingrOrnu : {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey : true
            },
            ingrName : {
                type: Sequelize.STRING(30),
                allowNull : false
            },
            enrollDate : {
                type: Sequelize.DATEONLY,
                allowNull : false,
                defaultValue: Sequelize.NOW
            },
            expyDate : {
                type: Sequelize.DATEONLY,
                allowNull : false
            },
            quantity : {
                type : Sequelize.DECIMAL(5, 2),
                allowNull : false
            },
            storageMthdType : {
                // 'f : 냉동, r : 냉장(기본), a : 실온' 내에서만 
                type : Sequelize.ENUM('f', 'r', 'a'),
                allowNull : false,
                validate: {
                    isIn : {
                        args: [['f', 'r', 'a']],
                    }
                },
                defaultValue : 'r'
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'RefEnrollIngr',
            tableName: 'ref_enroll_ingr',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // 관계 정의
    static associate(db) {
        // 관계 중 자신이 부모인
        this.hasMany(db.ImnIngrRecipe, {
            foreignKey : {
                name : 'ingrOrnu',
                primaryKey : true,
                allowNull : false
            },
            sourceKey : 'ingrOrnu'
        });
        this.hasMany(db.ImnIngrRecipe, {
            foreignKey : {
                name : 'refNum',
                primaryKey : true,
                allowNull : false
            },
            sourceKey : 'refNum'
        });

        // 관계 중 자신이 자식인
        this.belongsTo(db.Ref, {
            as : 'enrollIngrs',
            foreignKey : {
                name : 'refNum',
                primaryKey : true,
                allowNull : false
            },
            targetKey : 'refNum'
        });
        this.belongsTo(db.PresetIngr, {
            foreignKey : 'presetIngrNum',
            targetKey : 'presetIngrNum'
        });
    }
}