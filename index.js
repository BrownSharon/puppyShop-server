const express = require('express')
const cors = require('cors')
require('./dataConfig')
const path = require("path");

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))


app.use('/users', require('./routes/users'))
app.use('/products', require('./routes/products'))
app.use('/carts', require('./routes/carts'))
app.use('/orders', require('./routes/orders'))
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


app.listen(10778, () => console.log("up & running 10778"))