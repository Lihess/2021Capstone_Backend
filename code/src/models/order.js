// 21.05.30 이은비
// 주문(order) 모델
const Sequelize = require('sequelize');

module.exports = class Order extends Sequelize.Model {
    // 속성 정의
    static init(sequelize) {
        return super.init({
            orderNum : { 
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                unique: true,
                primaryKey : true
            },
            orderDate : {
                type : Sequelize.DATEONLY,
                allowNull: false,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Order',
            tableName: 'order',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // 관계 정의
    static associate(db) {
        // 관계 중 자신이 부모인
        this.hasMany(db.OrderProduct, {
            as : 'orderProducts',
            foreignKey : {
                name : 'orderNum',
                primaryKey : true,
                allowNull : false
            },
            sourceKey : 'orderNum'
        }),
        // 관계 중 자신이 자식인
        this.belongsTo(db.User, {
            foreignKey : {
                name : 'ordererNum',
                primaryKey : true,
                allowNull : false
            },
            targetKey : 'userNum',
          
        });
    } 
}