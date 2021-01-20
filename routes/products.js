const router = require('express').Router()
const { Query } = require('../dataConfig')
const { vt } = require('./vt')

router.get('/category', vt, async (req, res) => {
    try {
        const q = `select * from productCategory`
        const categories = await Query(q)
        res.json({ err: false, msg: categories })
    } catch (err) {
        console.log(err);
        res.json({ err: true, msg: err })
    }
})

router.get('/', vt, async (req, res) => {
    try {
        const { category_id, product } = req.query
        let q = 'select * from product'
        if (category_id || product) {
            q += ' where'
            if (category_id) {
                q += ` category_id=${category_id} and`
            }
            if (product) {
                q += ` name like '%${product}%' and`
            }
            q = q.slice(0, -4)
        }
        const products = await Query(q)
        res.json({ err: false, msg: products })
    } catch (err) {
        console.log(err);
        res.json({ err: true, msg: err })
    }
})

router.head('/', async (req, res) => {
    try {
        const q = `SELECT count(name) FROM product`
        const productsCount = await Query(q)
        res.json({ err: false, msg: productsCount })
    } catch (err) {
        console.log(err);
        res.json({ err: true, msg: err })
    }
})

router.post('/', vt, async (req, res) => {
    if (req.user.role === 1) {
        try {
            const { product, category_id, price, image } = req.body
            const q = `insert into product (name, category_id, price, image) values ("${product}",${category_id}, ${price}, "${image}")`
            await Query(q)

            const qq = 'select * from product'
            const products = await Query(qq)

            res.json({ err: false, msg: products })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    }else{
        console.log(err);
        res.json({ err: true, msg: "unauthorized action" })
    }
})

router.put('/:id', vt, async(req, res)=>{
    if (req.user.role === 1) {
        try {
            const { product, category_id, price, image } = req.body
            const q = `update product set name="${product}", category_id=${category_id}, price=${price}, image="${image}" where id=${req.params.id}`
            await Query(q)

            const qq = `select * from product where id=${req.params.id}`
            const product = await Query(qq)

            res.json({ err: false, msg: product })
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