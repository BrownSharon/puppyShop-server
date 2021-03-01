const router = require('express').Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { Query } = require('../dataConfig.js')
const { vt } = require('./vt')


// get user by id for checkUp in registration
router.get('/:id/:email', async (req, res) => {
    try {
        // check id
        let q = `SELECT * FROM user where israeliID=${req.params.id}`    
        let userCheckID = await Query(q)
        userCheckID = userCheckID[0]
        
        // check email
        q = `SELECT * FROM user where email='${req.params.email}'`    
        let userCheckEmail = await Query(q)
        userCheckEmail = userCheckEmail[0]

        if (userCheckID || userCheckEmail) return res.status(400).send("Id and/or email already exist in our data")
        res.json({ err: false, exists: false })
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }
})

// get 10 big cities (registration and order form)
router.get('/', async (req, res) => {
    try {
        let q = `SELECT * FROM city`    
        let cities = await Query(q)
        res.json({ err: false,cities })
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
        const q = `INSERT INTO user (israeliID, first_name, last_name, email, password, role_id, city, street, isLogin)
        values (${israeliID}, "${first_name}", "${last_name}", "${email}", "${hashedPassword}", ${user_role}, "${city}", "${street}", 1 );`
        await Query(q)

        const qq = `SELECT * FROM user WHERE israeliID="${israeliID}"`
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
            street: user.street,
            isLogin: true
        }, "EndOfCourse1", { expiresIn: "10m" })

        const refreshToken = jwt.sign({
            id: user.id,
            israeliID: user.israeliID,
            first_name: user.first_name,
            last_name: user.last_name,
            user_email: user.email,
            role: user.role_id,
            city: user.city,
            street: user.street,
            isLogin: true
        }, "EndOfCourse2", { expiresIn: "1h" })

        res.json({ err: false, token, refreshToken })

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }
})


// login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password)
            return res.status(400).json({ err: true, msg: "missing some info" })

        const q = `SELECT * FROM user WHERE email="${email}"`

        let user = await Query(q)
        user = user[0]

        if (!user) return res.status(401).json({ err: true, msg: "user not found" })

        if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ err: true, msg: "wrong password" })

        // only if the info is correct
        const qq = `update user set isLogin=true where id=${user.id}`
        await Query(qq)
        
        const token = jwt.sign({
            id: user.id,
            israeliID: user.israeliID,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role_id,
            city: user.city,
            street: user.street,
            isLogin: true
        }, "EndOfCourse1", { expiresIn: "10m" })

        const refreshToken = jwt.sign({
            id: user.id,
            israeliID: user.israeliID,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role_id,
            city: user.city,
            street: user.street,
            isLogin: true
        }, "EndOfCourse2", { expiresIn: "1h" })

        res.json({ err: false, token, refreshToken })
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }
})

// logout
router.put('/logout', vt, async(req,res)=>{
    try {
        const q = `update user set isLogin=false where id=${req.user.id}`
        await Query(q)
        const qq = `select * from user where id=${req.user.id}`
        const user = await Query(qq)
        res.json({err: false, user})
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }
})

// check tokens
router.get('/check', vt, async(req,res)=>{
    try {
        const user = req.user
        res.json({err:false, user})
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }
})


module.exports = router