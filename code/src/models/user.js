const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
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
                allowNull: true,
            },
            email :{
                type : Sequelize.STRING(15),
                unique: true,
                allowNull: true,
            },
            linkId :{
                type : Sequelize.STRING(30),
                allowNull: true
            }
        },
        {
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
} 