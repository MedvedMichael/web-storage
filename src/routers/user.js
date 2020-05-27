const { Router } = require('express')
const fs = require('fs')
const User = require('../models/user')
const authUser = require('../middleware/authUser')
// const authAdmin = require('../middleware/authAdmin')
const authMainAdmin = require('../middleware/authMainAdmin')
const router = Router()

router.post('/users', async (req, res) => {
    req.body.status = 'user'
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
        fs.appendFile(__dirname+"../../log.txt",`Action: POST,user:${user.name}  Type: user \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        refreshTokens(user)
        await user.save()
        res.status(200).send({ user, token })
        fs.appendFile(__dirname+"../../log.txt",`Action: POST,user:${user.name}  Type: userLogin \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

const refreshTokens = (user) => {
    const jwt = require('jsonwebtoken')
    user.tokens = user.tokens.filter((token) => {
        try {
            jwt.verify(token.token, process.env.JWT_SECRET)
            return true
        } catch (error) {
            return false
        }
    })
}

router.post('/users/logout', authUser, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await res.user.save()
        res.send()
        fs.appendFile(__dirname+"../../log.txt",`Action: POST,user:${req.user.name}  Type: userLOGOUT \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', authUser, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
        fs.appendFile(__dirname+"../../log.txt",`Action: POST,user:${req.user.name}  Type: userLOGOUTALL \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users/me', authUser, async (req, res) => {
    res.send(req.user)
    fs.appendFile(__dirname+"../../log.txt",`Action: GET,user:${req.user.name}  Type: user \n`,(err)=>{
        if(err)
            console.log(err)
    })
})

router.get('/usersall',authUser,authMainAdmin, async (req,res)=>{
    try {
        const users = await User.find({})
        if(!users)
          res.status(404).send()

        res.status(200).send(users)
        fs.appendFile(__dirname+"../../log.txt",`Action: GET,user:${req.user.name}  Type: usersall \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(400).send()
    }
})


router.patch('/users/me', authUser, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'nickname', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        if(updates.includes('password'))
            req.user.tokens = req.user.tokens.filter(token => token.token === req.token)
        
        await req.user.save()
        res.status(200).send(req.user)
        fs.appendFile(__dirname+"../../log.txt",`Action: PATCH,user:${req.user.name}  Type: user \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})

//only for main admins
router.patch('/users', authUser,authMainAdmin, async (req, res) => {
    
    const user = await User.findOne({ _id: req.query.id })
    if (!user)
        return res.status(404).send()

    if(!req.body.status)
        return res.status(400).send()
    
    user.status = req.body.status
    user.ban = req.body.ban
    try {
        await user.save()
        res.status(200).send(user)
        fs.appendFile(__dirname+"../../log.txt",`Action: PATCH,user:${user.name}  Type: user \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})



router.delete('/users/me', authUser, async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send()
        fs.appendFile(__dirname+"../../log.txt",`Action: DELETE,user:${req.user.name}  Type: user \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})



module.exports = router