const router = require('express').Router()
const { Query } = require('../dataConfig')
const { vt } = require('./vt')

// get total cart price
router.get('/:id', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const q = `SELECT sum(cartItem.product_total_price) as total_cart_price from cartItem where cart_id=${req.params.id}`
            let totalCartPrice = await Query(q)
            totalCartPrice = totalCartPrice[0].total_cart_price
            res.status(200).json({ err: false, totalCartPrice })
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: true, msg: err })
        }
    } else {
        res.status(401).json({ err: true, msg: "unauthorized action" })
    }
})

// add new cart 
router.post('/', vt, async (req,res)=>{
    if (req.user.role === 2) {
        try {
            let date = new Date()
            date = date.toISOString().slice(0,-14)
            const qq = `insert into cart (user_id, create_date) values (${req.user.id}, '${date}')`
            await Query(qq)

            const qqq = `SELECT * FROM cart where user_id=${req.user.id} and status=false`
            let cart = await Query(qqq)
            cart = cart[0]
            res.status(200).json({ err: false, cart })
        } catch (err) {
            res.status(500).json({ err: true, msg: err })
        }
    } else {
        res.status(401).json({ err: true, msg: "unauthorized action" })
    }
})

// delete all items in cart
router.delete('/:cart_id/items', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const q = `DELETE FROM cartItem WHERE cart_id=${req.params.cart_id}`
            await Query(q)

            const qq = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image FROM cartItem inner join product on product.id = product_id where cart_id=${req.params.cart_id}`
            const cartItems = await Query(qq)
            
            res.status(200).json({ err: false, cartItems })
        } catch (err) {
            res.status(500).json({ err: true, msg: err })
        }
    } else {
        res.status(401).json({ err: true, msg: "unauthorized action" })
    }
})

// get open cart for user
router.get('/', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            let q = ` SELECT * FROM cart where user_id=${req.user.id} and status=false`
            let cart = await Query(q)
            cart = cart[0]
            res.status(200).json({ err: false, cart })
        } catch (err) {
            res.status(500).json({ err: true, msg: err })
        }
    } else {
        res.status(401).json({ err: true, msg: "unauthorized action" })
    }
})

// change status of cart
router.put('/:cart_id', vt, async (req,res)=>{
    if (req.user.role === 2) {
        try {
            const {cart_id} = req.params
            const q = `update cart SET status=true WHERE id=${cart_id}`
            await Query(q)
            const qq = `select * from cart where id=${cart_id}`
            let cart = await Query(qq)
            cart = cart[0]
            res.status(200).json({ err: false, cart })
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: true, msg: err })
        }
    } else {
        res.status(401).json({ err: true, msg: "unauthorized action" })
    }
})

// get cart items for user
router.get('/:cart_id/items', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const { cart_id } = req.params
            let q = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image  FROM cartItem
            inner join product on product.id = product_id where cart_id=${cart_id}`
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
router.post('/:cart_id/items', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const { product_id, product_amount, product_total_price} = req.body
            const q = `select * from cartItem where cart_id=${req.params.cart_id} and product_id=${product_id}`
            const itemInCart = await Query(q)
            
            if (itemInCart.length !== 0) {
                const qq = `update cartItem set product_amount= ${product_amount}, product_total_price= ${product_total_price} where id=${itemInCart[0].id}`
                await Query(qq)

            } else {
                const qq = `insert into cartItem (product_id, product_amount, product_total_price, cart_id) values (${product_id},${product_amount},${product_total_price},${req.params.cart_id})`
                await Query(qq)
            }

            const qqq = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image FROM cartItem inner join product on product.id = product_id where cart_id=${req.params.cart_id}`
            cartItems = await Query(qqq)
            
            const qqqq = `SELECT sum(cartItem.product_total_price) as total_cart_price from cartItem where cart_id=${req.params.cart_id}`
            let totalCartPrice = await Query(qqqq)
            totalCartPrice = totalCartPrice[0].total_cart_price
            
            res.status(200).json({err:false, cartItems, totalCartPrice})
        } catch (err) {
            res.status(500).json({ err: true, msg: err })
        }
    } else {
        res.status(401).json({ err: true, msg: "unauthorized action" })
    }
})

// edit amount of items
router.put('/:cart_id/items/:item_id', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const {product_amount, total_price} = req.body
            const q = `update cartItem set product_amount = ${product_amount} , product_total_price= ${total_price} where id=${req.params.item_id}`
            await Query(q)

            const qq = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image FROM cartItem inner join product on product.id = product_id where cart_id=${req.params.cart_id}`
            const cartItems = await Query(qq)

            const qqq = `SELECT sum(cartItem.product_total_price) as total_cart_price from cartItem where cart_id=${req.params.cart_id}`
            let totalCartPrice = await Query(qqq)
            totalCartPrice = totalCartPrice[0].total_cart_price
            
            res.status(200).json({err:false, cartItems, totalCartPrice})
        } catch (err) {
            res.status(500).json({ err: true, msg: err })
        }
    } else {
        res.status(401).json({ err: true, msg: "unauthorized action" })
    }
})

// delete item from cart
router.delete('/:cart_id/items/:item_id', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            
            const q = `DELETE FROM cartItem WHERE id=${req.params.item_id}`
            await Query(q)

            const qq = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image FROM cartItem inner join product on product.id = product_id where cart_id=${req.params.cart_id}`
            const cartItems = await Query(qq)
            res.status(200).json({ err: false, cartItems })
        } catch (err) {
            res.status(500).json({ err: true, msg: err })
        }
    } else {
        res.status(401).json({ err: true, msg: "unauthorized action" })
    }
})

module.exports = router