// 21.05.26 이은비
const Sequelize = require('sequelize');

// 정의된 모델 연결
const User = require('./user');

const db = {User};

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
)
const Models = Object.keys(db);

// DB 생성
Models.forEach((model) => {
  if (db[model].init) db[model].init(sequelize);
});

Models.forEach((model) => {
  if (db[model].associate) db[model].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
