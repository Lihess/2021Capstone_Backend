const express = require('express')

const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

// DB 연결
const models = require("./src/models/index.js");

models.sequelize.sync().then( () => {
  console.log("...DB Link success");
}).catch(err => {
  console.log("...DB Link fail");
  console.log(err);
})

// req의 body를 받기위해
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 연결
const userRouter = require('./src/routes/user')
const refRouter = require('./src/routes/ref')
const refEnrollIngrRouter = require('./src/routes/refEnrollInger')
const orderRouter = require('./src/routes/order')
const orderProductRouer = require('./src/routes/orderProduct')
const imnIngrReciepRouer = require('./src/routes/imnIngrRecipe')
const bookmarkRecipeRouter = require('./src/routes/bookmarkRecipe');
const indexRouter = require('./src/routes/index');
const recipeIngrRouter = require('./src/routes/recipeIngr');
const recipeProcRouter = require('./src/routes/recipeProc');
const recipeRouter = require('./src/routes/recipe');
const presetIngrRouter = require('./src/routes/presetIngr')

app.use('/api/user', userRouter)
app.use('/api/ref', refRouter)
app.use('/api/ref-enroll-ingr', refEnrollIngrRouter)
app.use('/api/order', orderRouter)
app.use('/api/order-product', orderProductRouer)
app.use('/api/bookmark-recipe', bookmarkRecipeRouter)
app.use('/api/imn-ingr-recipe', imnIngrReciepRouer)
app.use('/api', indexRouter)
app.use('/api/recipe-ingr', recipeIngrRouter)
app.use('/api/recipe-proc', recipeProcRouter)
app.use('/api/recipe', recipeRouter)
app.use('/api/preset-ingr', presetIngrRouter)

app.listen(3000, () => console.log('...lisen port 3000'))