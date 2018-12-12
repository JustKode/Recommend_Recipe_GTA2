const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const session = require('express-session')
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger/swagger.yaml')
require('dotenv').config()

app.use(morgan('[:date[iso]] :method :status :url :response-time(ms) :user-agent'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
    res.header('Access-Control-Allow-Headers', 'content-type')
    next()
  })
app.use(session({
    secret:process.env.SECRETKEY,
    resave:false,
    saveUninitialized:true,
    cookie: {secure:true}
}))
app.use('/api', require('./api'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(process.env.PORT, () => {
    console.log(`listening on port: ${process.env.PORT}`)
})
app.use('/', express.static(__dirname + '/public'))