// 21.05.30 이은비
// 기본식자재(presetIngr) 모델
const Sequelize = require('sequelize');

module.exports = class PresetIngr extends Sequelize.Model {
    // 속성 정의
    static init(sequelize) {
        return super.init({
            presetIngrNum : {
                type : Sequelize.CHAR(3),
                allowNull: false,
                unique: true,
                primaryKey : true
            },
            prsetIngrName : {
                type: Sequelize.STRING(30),
                allowNull : false
            },
            expyDate : {
                type: Sequelize.DATEONLY,
                allowNull : false
            },
            ingrType : {
                // 'g : 곡물(기본), v : 야채, f : 과일, m : 육류, a : 수산물, s : 양념, c : 조미료, d : 유제품, b : 음료, e : 기타' 내에서만
                type : Sequelize.ENUM('g', 'v', 'f', 'm', 'a', 's', 'c', 'd', 'b', 'e'),
                allowNull : false,
                defaultValue : 'g'
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Presetingr',
            tableName: 'preset_ingr',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // 관계 정의
    static associate(db) {
        this.hasMany(db.RefEnrollIngr, {
            foreignKey : 'presetIngrNum',
            sourceKey : 'presetIngrNum'
        });
    }
}