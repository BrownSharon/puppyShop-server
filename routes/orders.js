const router = require('express').Router()
const { Query } = require('../dataConfig')
const { vt } = require('./vt')
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");

// count number of orders in site
router.get('/count', async (req, res) => {
    try {
        const q = `SELECT count(id) as numberOfOrders from shopOrder`
        let numberOfOrders = await Query(q)
        numberOfOrders = numberOfOrders[0].numberOfOrders
        res.status(200).json({ err: false, numberOfOrders })
    } catch (err) {
        res.status(500).json({ err: true, msg: err })
    }
})

// get last order for user 
router.get('/', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const q = `SELECT max(closing_date) as closing_date from shopOrder where user_id=${req.user.id}`
            const lastOrderDate = await Query(q)
            if (lastOrderDate[0].closing_date) {
                const qq = `SELECT * from shopOrder where user_id=${req.user.id} and closing_date="${lastOrderDate[0].closing_date}"`
                let order = await Query(qq)
                order = order[0]
                res.status(200).json({ err: false, order })
            } else {
                res.status(204).json({ err: false, msg: "There is no last order" })
            }

        } catch (err) {
            res.status(500).json({ err: true, msg: err })
        }
    } else {
        res.status(401).json({ err: true, msg: "unauthorized action" })
    }
})

// add new order
router.post('/', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const { user_id, cart_id, order_total_price, city, street, delivery_date, closing_date, credit_card } = req.body

            const q = `insert into shopOrder (user_id, cart_id, order_total_price, city, street, delivery_date, closing_date, credit_card) values (${user_id}, ${cart_id}, ${order_total_price}, "${city}", "${street}", "${delivery_date}", "${closing_date}", ${credit_card})`
            await Query(q)

            const qq = `select * from shopOrder where cart_id=${cart_id}`
            let order = await Query(qq)
            order = order[0]
            res.status(200).json({ err: false, order })
        } catch (err) {
            res.status(500).json({ err: true, msg: err })
        }
    } else {
        res.status(401).json({ err: true, msg: "unauthorized action" })
    }
})

// get orders dates for filtering the delivery day in order form
router.get('/dates', vt, async (req, res) => {
    if (req.user.role === 2) {
        try {
            const q = `select * from (SELECT shopOrder.delivery_date, count(shopOrder.delivery_date) as counter FROM shopOrder group by shopOrder.delivery_date) as dateFilter where counter > 2 and year(delivery_date) >= year(now()) and month(delivery_date) >= month(now())`
            const filteredDates = await Query(q)
            console.log(filteredDates);
            res.status(200).json({ err: false, filteredDates })
        } catch (err) {
            res.status(500).json({ err: true, msg: err })
        }
    } else {
        res.status(401).json({ err: true, msg: "unauthorized action" })
    }
})

// get receipt file 
router.get('/:order_id/receipt', async (req, res) => {
    // if (req.user.role === 2) {
    try {
        const q = `select * from (SELECT shopOrder.id as order_id, shopOrder.user_id, user.first_name, user.last_name, user.email, user.israeliID, user.city as user_city, user.street as user_street, shopOrder.cart_id , shopOrder.order_total_price, shopOrder.delivery_date, shopOrder.closing_date, shopOrder.city as order_city, shopOrder.street as order_street, shopOrder.credit_card FROM shopOrder left join user on shopOrder.user_id = user.id) as user_order left join (SELECT cartItem.cart_id as cartID, cartItem.id as cartItem_id , cartItem.product_id, product.name, cartItem.product_amount, product.price, cartItem.product_total_price, product.image  FROM cartItem inner join product on product.id = product_id) as cart_products on user_order.cart_id = cart_products.cartID where order_id = ${req.params.order_id}`
        const orderData = await Query(q)

        ejs.renderFile(path.join(__dirname, './views', "receipt_template.ejs"), { orderData: orderData }, (err, data) => {
            if (err) {
                console.log("receipt test");
                res.status(404).json({ err: false, msg: "There is no order with this id" })
            } else {
                let options = {
                    "height": "11.25in",
                    "width": "8.5in",
                    "header": {
                        "height": "20mm"
                    },
                    "footer": {
                        "height": "20mm",
                    },
                };

                pdf.create(data, options).toFile(`public/receipt${req.params.order_id}.pdf`, function (err, data) {
                    if (err) {
                        res.status(400).json({ err: true, msg: err })
                    } else {
                       
                        res.status(200).download(data.filename);
                    }
                });
            }
        });
    } catch (err) {
        res.status(500).json({ err: true, msg: err })
    }
    // } else {
    //     res.status(401).json({ err: true, msg: "unauthorized action" })
    // }
})

module.exports = router
