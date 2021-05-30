// 21.05.30 이은비
// 주문상품(orderProduct) 모델
const Sequelize = require('sequelize');

module.exports = class OrderProduct extends Sequelize.Model {
    // 속성 정의
    static init(sequelize) {
        return super.init({
            productOrnu : {
                type : Sequelize.CHAR(10),
                allowNull: false,
                primaryKey : true
            },
            productName : {
                type : Sequelize.STRING(30),
                allowNull: false,
            },
            quantity : {
                type : Sequelize.DECIMAL(5, 2),
                allowNull : false
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'OrderProduct',
            tableName: 'order_product',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // 관계 정의
    static associate(db) {
        this.belongsTo(db.Order, {
            foreignKey : {
                name : 'orderNum',
                primaryKey : true,
                allowNull : false
            },
            targetKey : 'orderNum',
        });
    }
}