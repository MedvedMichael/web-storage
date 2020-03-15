const { Router } = require('express')

const User = require('../models/user')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const router = Router()

router.post('/users', async (req, res) => {
    req.body.status = 'user'
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout', authUser, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await res.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', authUser, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users/me', authUser, async (req, res) => {
    res.send(req.user)
})

router.get('/usersall',authUser,authAdmin, async (req,res)=>{
    try {
        const users = await User.find({})
        if(!users)
          res.status(404).send()

        res.status(200).send(users)
    } catch (error) {
        res.status(400).send()
    }
})


router.patch('/users/me', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

//only for admins
router.patch('/users/:id', authUser, authAdmin, async (req, res) => {
    
    const user = await User.findOne({ _id: req.params.id })
    if (!user)
        return res.status(404).send()

    if(!req.body.status)
        return res.status(400).send()
    
    user.status = req.body.status
    try {
        await user.save()
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send()
    }
})



router.delete('/users/me', authUser, async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})



module.exports = router