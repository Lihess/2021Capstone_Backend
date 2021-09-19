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

app.use('/api/user', userRouter)
app.use('/api/ref', refRouter)

app.listen(3000, () => console.log('...lisen port 3000'))