const router = require('express').Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { Query } = require('../dataConfig.js')



// get user 
// or search for user by id or email ==> for validation in the registration
router.get('/', async (req, res) => {
    try {
        const {israeliID, email} = req.query
        let q = `SELECT * FROM users`
        if (israeliID || email){
            q += ' WHERE'
            if (email) {
                q += ` email="${req.query.email}" and`
            }
            if (israeliID) {
                q += ` israeliIB="${req.query.israeliID}" and`
            }
            q = q.split(0, -4) 
        } 
            
        let userCheckUp = await Query(q)
        userCheckUp = userCheckUp[0]
        if (userCheckUp) return res.status(400).json({ err: true, msg: "already in the service, check again" })
        res.json({ err: false, msg: userCheckUp })
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }
})

// registration
router.post('/', async (req, res) => {
    try {
        const { israeliID, email, password, first_name, last_name, city, street } = req.body

        // check if the all fields are full (after all the validation in client side)
        if (!israeliID || !email || !password || !first_name || !last_name || !city || !street) return res.status(400).json({ err: true, msg: "missing some info" })

        // hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        const user_role = 2

        // insert the user to users table
        const q = `INSERT INTO users (israeliID, first_name, last_name, email, password, role_id, city, street)
        values (${israeliID}, "${first_name}", "${last_name}", "${email}", "${hashedPassword}", ${user_role}, "${city}", "${street}" );`
        await Query(q)

        const qq = `SELECT * FROM users WHERE israeliID="${israeliID}"`
        let user = await Query(qq)
        user = user[0]

        // only if the info is correct

        const token = jwt.sign({
            id: user.id,
            israeliID: user.israeliID,
            first_name: user.first_name,
            last_name: user.last_name,
            user_email: user.email,
            role: user.role_id,
            city: user.city,
            street: user.street
        }, "EndOfCourse1", { expiresIn: "1m" })

        const refreshToken = jwt.sign({
            id: user.id,
            israeliID: user.israeliID,
            first_name: user.first_name,
            last_name: user.last_name,
            user_email: user.email,
            role: user.role_id,
            city: user.city,
            street: user.street
        }, "EndOfCourse2", { expiresIn: "10m" })

        res.json({ err: false, msg: {token, refreshToken }})

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }
})


// login
router.post('/token', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password)
            return res.status(400).json({ err: true, msg: "missing some info" })

        const q = `SELECT * FROM users WHERE email="${email}"`

        let user = await Query(q)
        user = user[0]

        if (!user) return res.status(401).json({ err: true, msg: "user not found" })

        console.log(bcrypt.compareSync(password, user.password));

        if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ err: true, msg: "wrong password" })

        // only if the info is correct

        const token = jwt.sign({
            id: user.id,
            israeliID: user.israeliID,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role_id,
            city: user.city,
            street: user.street
        }, "EndOfCourse1", { expiresIn: "1m" })

        const refreshToken = jwt.sign({
            id: user.id,
            israeliID: user.israeliID,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role_id,
            city: user.city,
            street: user.street
        }, "EndOfCourse2", { expiresIn: "10m" })

        res.json({ err: false, msg: {token, refreshToken }})
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }
})


module.exports = router