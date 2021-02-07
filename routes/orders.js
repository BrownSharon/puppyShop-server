const router = require('express').Router()
const { Query } = require('../dataConfig')
const { vt } = require('./vt')

// count number of orders in site
router.get('/number', async (req, res) => {
    try {
        const q = `SELECT count(id) as numberOfOrders from shopOrder`
        let numberOfOrders = await Query(q)
        numberOfOrders = numberOfOrders[0].numberOfOrders
        res.json({ err: false, numberOfOrders })
    } catch (err) {
        console.log(err);
        res.json({ err: true, msg: err })
    }
})

// get last order for user 
router.get('/last', vt, async(req,res)=>{
    if (req.user.role === 2) {
        try {
            const q = `SELECT max(closing_date) as closing_date from shopOrder where user_id=${req.user.id}`
            const lastOrderDate = await Query(q)
            if (lastOrderDate[0].closing_date){
                const qq= `SELECT * from shopOrder where user_id=${req.user.id} and closing_date="${lastOrderDate[0].closing_date}"`
                const lastOrder = await Query(qq)
                res.json({ err: false, lastOrder })
            }else{
                res.json({ err: false, msg:"didn't find last order" })
            }
            
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
    }
})

// add new order
router.post('/', vt, async(req,res)=>{
    if (req.user.role === 2) {
        try {
           const {user_id, cart_id, order_total_price, city, street, delivery_date, closing_date, credit_card} = req.body

           const q= `insert into shopOrder (user_id, cart_id, order_total_price, city, street, delivery_date, closing_date, credit_card) values (${user_id}, ${cart_id}, ${order_total_price}, "${city}", "${street}", "${delivery_date}", "${closing_date}", ${credit_card})`
            await Query(q)

            const qq= `select * from shopOrder where cart_id=${cart_id}`
            const newOrder = await Query(qq)
            res.json({ err: false, newOrder })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
    }
})

// get orders dates for filtering the delivery day in order form
router.get('/dates', vt, async (req,res)=>{
    if (req.user.role === 2) {
        try {
            const q =`select * from (SELECT shopOrder.delivery_date, count(shopOrder.delivery_date) as counter FROM shopOrder 
            group by shopOrder.delivery_date) as dateFilter where dateFilter.counter > 2`
            const filteredDates = await Query(q)
            res.json({ err: false, filteredDates })
        } catch (err) {
            console.log(err);
            res.json({ err: true, msg: err })
        }
    } else {
        res.json({ err: true, msg: "unauthorized action" })
    }
})

// get receipt file --- need to be done 
router.get('/receipt/:id', vt, async(req,res)=>{
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