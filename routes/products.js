const router = require('express').Router()
const { Query } = require('../dataConfig')
const { vt } = require('./vt')

// get all categories
router.get('/category', vt, async (req, res) => {
    try {
        const q = `select * from productCategory`
        const categories = await Query(q)
        res.json({ err: false, categories })
    } catch (err) {
        console.log(err);
        res.json({ err: true, msg: err })
    }
})

// get products by category or search product by name
router.get('/', vt, async (req, res) => {
    try {
        const { category_id, name } = req.query
        let q = 'SELECT product.id, product.name, product.category_id, product.price, product.image, cartItem.id as cartItem_id, cartItem.product_id, cartItem.product_amount, cartItem.product_total_price, cartItem.cart_id FROM product left join cartItem on cartItem.product_id = product.id'
        if (category_id || name) {
            q += ' where'
            if (category_id) {
                q += ` category_id=${category_id} and`
            }
            if (name) {
                q += ` name like '%${name}%' and`
            }
            q = q.slice(0, -4)
        }
        const products = await Query(q)
        res.json({ err: false, products })
    } catch (err) {
        console.log(err);
        res.json({ err: true, msg: err })
    }
})

// get amount of products in site
router.get('/number', async (req, res) => {
    try {
        const q = `SELECT count(name) as productsCount FROM product`
        const productsCount = await Query(q)
        res.json({ err: false, productsCount })
    } catch (err) {
        console.log(err);
        res.json({ err: true, msg: err })
    }
})

// add product
router.post('/', vt, async (req, res) => {
    if (req.user.role === 1) {
        try {
            const { name, category_id, price, image } = req.body
            const q = `insert into product (name, category_id, price, image) values ("${name}",${category_id}, ${price}, "${image}")`
            await Query(q)

            const qq = 'SELECT * FROM product'
            const products = await Query(qq)
            res.json({ err: false, products })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    }else{
        console.log(err);
        res.json({ err: true, msg: "unauthorized action" })
    }
})

// edit product
router.put('/:id', vt, async(req, res)=>{
    if (req.user.role === 1) {
        try {
            const { name, category_id, price, image } = req.body
            const q = `update product set name="${name}", category_id=${category_id}, price=${price}, image="${image}" where id=${req.params.id}`
            await Query(q)

            const qq = `SELECT * FROM product where id=${req.params.id}`
            const productItem = await Query(qq)

            res.json({ err: false,  productItem })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    }else{
        console.log(err);
        res.json({ err: true, msg: "unauthorized action" })
    }
})

module.exports = router