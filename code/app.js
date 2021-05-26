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


app.listen(3000, () => console.log('...lisen port 3000'))