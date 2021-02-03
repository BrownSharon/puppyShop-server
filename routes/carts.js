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
            res.json({ err: false, totalCartPrice })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
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
            cart = await Query(qqq)
            res.json({ err: false, cart })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
    }
})

// delete all items in cart
router.delete('/:id', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const q = `DELETE FROM cartItem WHERE cart_id=${req.params.id}`
            await Query(q)

            const qq = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image FROM cartItem inner join product on product.id = product_id where cart_id=${cart_id}`
            const cartItems = await Query(qq)
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

// get open cart for user
router.get('/', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            let q = ` SELECT * FROM cart where user_id=${req.user.id} and status=false`

            const openCart = await Query(q)
            res.json({ err: false, openCart })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
    }
})

// change status of cart
router.put('/', vt, async (req,res)=>{
    if (req.user.role === 2) {
        try {
            const {id} = req.body
            const q = `update cart SET status=true WHERE id=${id}`
            await Query(q)
            const qq = `select * from cart where id=${id}`
            const openCart = await Query(qq)
            res.json({ err: false, openCart })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
    }
})
module.exports = router