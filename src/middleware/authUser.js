const User = require('../models/user')
const jwt = require('jsonwebtoken')

const authUser = async (req, res, next) => {
    try {
        
        const token = req.header('Authorization').replace('Bearer ', '')
        let user
        if (token === process.env.MAIN_ADMIN_TOKEN) {
            user = new User({
                name: 'MAINAdmin',
                nickname: 'MAINadmin',
                status: 'main-admin',
                email: process.env.MAIN_ADMIN_EMAIL,
                password: process.env.MAIN_ADMIN_PASSWORD
            })
        }
        else if (token === process.env.ADMIN_TOKEN) {
            user = new User({
                name: 'Admin',
                nickname: 'admin',
                status: 'admin',
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            })
        }
        else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
            if (!user)
                throw new Error()
        }

        req.user = user
        req.token = token

        
        if(!req.user.ban)
            next()

        
    } catch (error) {
        res.status(401).send('Please authenticate!')
    }
}

module.exports = authUser