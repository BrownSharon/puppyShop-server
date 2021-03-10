const router = require('express').Router()
const { Query } = require('../dataConfig')
const { vt } = require('./vt')

// get all categories
router.get('/category', vt, async (req, res) => {
    try {
        const q = `select * from productCategory`
        const categories = await Query(q)
        res.status(200).json({ err: false, categories })
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }
})

// get all products
router.get('/', vt, async (req, res) => {
    try {
        const { cart_id, category_id, name } = req.query
        let q
        if (req.user.role === 2) {
            q = `SELECT * FROM product left join  (SELECT cartItem.id as itemCartID, cartItem.cart_id, cartItem.product_id, cartItem.product_amount, cartItem.product_total_price FROM cartItem where cart_id = ${req.query.cart_id}) as current_cart_items on current_cart_items.product_id = product.id`
        } else {
            q='SELECT * FROM product'
        }
        const products = await Query(q)
        res.status(200).json({ err: false, products })

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }
})

// get amount of products in site
router.get('/count', async (req, res) => {
    try {
        const q = `SELECT count(id) as productsCount FROM product`
        let productsCount = await Query(q)
        productsCount = productsCount[0].productsCount
        res.status(200).json({ err: false, productsCount })
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }
})

// admin only
// add product
router.post('/', vt, async (req, res) => {
    if (req.user.role === 1) {
        try {
            const { name, category_id, price, image } = req.body
            const q = `insert into product (name, category_id, price, image) values ("${name}",${category_id}, ${price}, "${image}")`
            await Query(q)

            const qq = 'SELECT * FROM product'
            const products = await Query(qq)
            res.status(200).json({ err: false, products })
        } catch (err) {
            res.status(500).json({ err: true, msg: err })
        }
    } else {
        res.status(401).json({ err: true, msg: "unauthorized action" })
    }
})

// admin only
// edit product
router.put('/:id', vt, async (req, res) => {
    if (req.user.role === 1) {
        try {
            const { name, category_id, price, image } = req.body
            const q = `update product set name="${name}", category_id=${category_id}, price=${price}, image="${image}" where id=${req.params.id}`
            await Query(q)

            const qq = `SELECT * FROM product where id=${req.params.id}`
            const productItem = await Query(qq)

            res.status(200).json({ err: false, productItem })
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: true, msg: err })
        }
    } else {
        console.log(err);
        res.status(401).json({ err: true, msg: "unauthorized action" })
    }
})

module.exports = router