const {Router} = require('express')

const User = require('../models/user')
const authUser = require('../middleware/authUser')
const router = Router()

router.post('/users', async (req,res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/login', async (req,res)=>{
    try {
        const user = User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/logout', authUser, async (req,res)=>{
    
})

module.exports = router