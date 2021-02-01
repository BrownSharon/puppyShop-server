const router = require('express').Router()
const { Query } = require('../dataConfig')
const { vt } = require('./vt')


// get items cart
router.get('/', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const { cart_id, name } = req.query
            let q = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image  FROM cartItem
            inner join product on product.id = product_id where cart_id=${cart_id}`

            if (name){
                q += ` and name like '%${name}%'`
            }
            const cartItems = await Query(q)
            res.json({ err: false, cartItems })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
    }
})

// add item to cart
router.post('/', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const { product_id, product_amount, product_total_price, cart_id } = req.body
            const q = `select * from cartItem where product_id=${product_id}`
            const itemInCart = await Query(q)
            if (itemInCart.length != 0) {
                console.log("update");
                const qq = `update cartItem set product_amount= ${product_amount}, product_total_price= ${product_total_price} where id=${itemInCart[0].id}`
                await Query(qq)
            } else {
                console.log("add");
                const qq = `insert into cartItem (product_id, product_amount, product_total_price, cart_id) values (${product_id},${product_amount},${product_total_price},${cart_id})`
                console.log(qq);
                await Query(qq)
            }

            const qqq = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image  FROM cartItem inner join product on product.id = product_id where cart_id=${cart_id}`
            const cartItems = await Query(qqq)
            console.log(cartItems);
            res.json({ err: false, cartItems })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
    }
})

// edit amount of items --> extra
router.put('/', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const {product_amount, id, total_price, cart_id} = req.body
            const q = `update cartItem set product_amount = ${product_amount} , product_total_price= ${total_price} where id=${id}`
            await Query(q)

            const qq = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image FROM cartItem inner join product on product.id = product_id where cart_id=${cart_id}`

            const cartItems = await Query(qq)
            res.json({err:false, cartItems})
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
    }
})


// delete item from cart
router.delete('/:id/:cart_id', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            console.log(req.params);
            const q = `DELETE FROM cartItem WHERE id=${req.params.id}`
            await Query(q)

            const qq = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image FROM cartItem inner join product on product.id = product_id where cart_id=${req.params.cart_id}`
            const cartItems = await Query(qq)
            res.json({ err: false, cartItems })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
    }
})


module.exports = router