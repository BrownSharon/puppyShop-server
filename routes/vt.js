const jwt = require('jsonwebtoken')

const vt = async (req, res, next) => {
    // check token
    jwt.verify(req.headers.token, "EndOfCourse1", (err, payload) => {
        if (err) {
            // check refresh token
            jwt.verify(req.headers.refreshToken, "EndOfCourse2", (err, payload) => {
                if (err) {
                    console.log(err);
                    res.status(401).json({ err: true, msg: err })
                } else {
                    const token = jwt.sign({
                        id: user.id,
                        israeliID: payload.israeliID,
                        first_name: payload.first_name,
                        last_name: payload.last_name,
                        email: payload.email,
                        role: payload.role_id,
                        city: payload.city,
                        street: payload.street,
                        isLogin: true
                    }, "EndOfCourse1", { expiresIn: "1m" })
                    req.user = payload
                    req.token = token
                    next()
                }
            })
        } else {
            req.user = payload
            next()
        }
    })
}

module.exports = { vt }