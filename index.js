const express = require('express')
const cors = require('cors')
require('./dataConfig')
const path = require("path");

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))


app.use('/users', require('./routes/users'))
app.use('/products', require('./routes/products'))
app.use('/carts', require('./routes/carts'))
app.use('/itemsCart', require('./routes/itemsCart'))
app.use('/orders', require('./routes/orders'))
app.use('/api', require('./routes/api'))

app.get('/', (req, res) => {
	res.send('Its coming soon just wait.')
})

app.listen(10778, () => console.log("up & running 10778"))