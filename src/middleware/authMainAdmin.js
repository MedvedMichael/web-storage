const authMainAdmin = async (req, res, next) => {
    if (req.user.status !== 'main-admin')
        return res.status(401).send('You\'re not an main admin!')

    next()
}

module.exports = authMainAdmin