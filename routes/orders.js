const router = require('express').Router()
const { Query } = require('../dataConfig')
const { vt } = require('./vt')

// count number of order in site
router.head('/', async (req, res) => {
    try {
        const q = ` SELECT count(id) as numberOfOrders from shopOrder`
        const numberOfOrders = await Query(q)
        res.json({ err: false, msg: numberOfOrders })
    } catch (err) {
        console.log(err);
        res.json({ err: true, msg: err })
    }
})

// get last order for user 
router.get('/', vt, async(req,res)=>{
    if (req.user.role === 2) {
        try {
            const q = `SELECT max(closing_date) from shopOrder where user_id=${req.user.id}`
            const lastOrderDate = await Query(q)

            const qq= `SELECT * from shopOrder where user_id=${req.user.id} and closing_date="${lastOrderDate}"`

            const lastOrder = await Query(qq)
            res.json({ err: false, msg: lastOrder })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
    }
})

// add new order
router.post("/", vt, async(req,res)=>{
    if (req.user.role === 2) {
        try {
           const {user_id, cart_id, order_total_price, city, street, delivery_data, closing_date, credit_card} = req.body

           const q= `insert into shopOrder (user_id, cart_id, order_total_price, city, street, delivery_data, closing_date, credit_card)
           -- values (${user_id}, ${cart_id}, ${order_total_price}, "${city}", "${street}", "${delivery_data}", "${closing_date}", ${credit_card})`
            await Query(q)

            const qq= `select * from shopOrder where cart_id=${cart_id}`
            const newOrder = await Query(qq)
            res.json({ err: false, msg: newOrder })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
    }
})

// get receipt file --- need to be done 
router.post('/receipt/:id', vt, async(req,res)=>{
    if (req.user.role === 2) {
        try {
            

            res.json({ err: false, msg: newOrder })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
    }
})

module.exports = router