const router = require('express').Router()
const { Query } = require('../dataConfig')
const { vt } = require('./vt')

// get open cart for user
router.get('/:id', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            let q = ` SELECT cartItem.cart_id, cartItem.id as cartItem_id, cartItem.product_total_price, cart.user_id, cart.create_date, cart.status FROM cartItem inner join cart on cart.id = cart_id where user_id=${req.user.id} and status=false`

            const openCart = await Query(q)
            res.json({ err: false, openCart })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    }
})

// get items cart + search
router.get('/', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const { cart_id, product_name } = req.query
            let q = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price  FROM cartItem
            inner join product on product.id = product_id where cart_id=${cart_id}`

            if (cart_id) {
                q += ` and name like '%${product_name}%'`
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

// get total cart price
router.head('/:id', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const q = `SELECT sum(cartItem.product_total_price) as total_cart_price from cartItem where cart_id=${req.params.id}`

            const totalCartPrice = await Query(q)
            res.json({ err: false, totalCartPrice })
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
            const q = `insert into cartItem (product_id, product_amount, product_total_price, cart_id) values (product_id=${product_id}, product_amount=${product_amount}, product_total_price=${product_total_price}, cart_id=${cart_id})`
            await Query(q)

            const qq = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price  FROM cartItem inner join product on product.id = product_id where cart_id=${cart_id}`
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

// edit amount of items --> extra
// router.patch('/', async (req, res) => {
//     if (req.user.role === 2) {
//         try {
//             const { cartItem_id, product_amount, product_total_price, cart_id } = req.body
//             const q = ``

//             await Query(q)
//             const qq = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image FROM cartItem inner join product on product.id = product_id where cart_id=${cart_id}`
//             const cartItems = await Query(qq)
//             res.json({ err: false, cartItems })
//         } catch (err) {
//             console.log(err);
//             res.json({ err: true, msg: err })
//         }
//     } else {
//         res.json({ err: true, msg: "unauthorized action" })
//     }
// })

// delete item from cart
router.delete('/:id', async (req, res) => {
    if (req.user.role === 2) {
        try {

            const q = `DELETE FROM cartItem WHERE id=${req.params.id}`
            await Query(q)

            const qq = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image FROM cartItem inner join product on product.id = product_id where cart_id=${cart_id}`
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

// delete all items in cart
router.delete('/all/:id', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const q = `DELETE FROM cartItem WHERE cart_id=${req.params.id}`
            await Query(q)

            const qq = `SELECT cartItem.cart_id, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image FROM cartItem inner join product on product.id = product_id where cart_id=${cart_id}`
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