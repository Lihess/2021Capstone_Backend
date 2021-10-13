// 21.05.26 이은비 - 생성
// 21.05.30 이은비 - 모델, DB 연결
const Sequelize = require('sequelize');
require('dotenv').config() // 환경변수 사용을 위해

// 정의된 모델 불러오기
const User = require('./user');
const Order = require('./order');
const OrderProduct = require('./orderProduct');
const Ref = require('./ref')
const RefEnrollIngr = require('./refEnrollIngr')
const PresetIngr = require('./presetIngr')
const ImnIngrRecipe = require('./imnIngrRecipe')
const Recipe = require('./recipe')
const RecipeIngr = require('./recipeIngr')
const RecipeProc = require('./recipeProc')
const BookmarkRecipe = require('./bookmarkRecipe')

// DB에 모델 정의
const db = {
  User, Order, OrderProduct, Ref, RefEnrollIngr, PresetIngr, 
  ImnIngrRecipe, Recipe, RecipeIngr, RecipeProc, BookmarkRecipe
};

// config 연결
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME, 
  process.env.MYSQL_PASSWORD,
<<<<<<< HEAD
    { 
      dialectOptions : {
        useUTC: false, // for reading from database
      },
      host : process.env.MYSQL_HOSTNAME, 
      dialect : 'mysql', 
      timezone : "+09:00",
=======
    {
      host : process.env.MYSQL_HOSTNAME, 
      dialect : 'mysql', 
      timezone : process.env.TZ
>>>>>>> test
    }
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
