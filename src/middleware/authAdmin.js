const authAdmin = async (req, res, next) => {
    if (req.user.status !== 'admin')
        return res.status(401).send('You\'re not an admin!')
    
    next()
}

module.exports = authAdmin