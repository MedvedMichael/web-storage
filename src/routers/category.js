const { Router } = require('express')
const Category = require('../models/category')
const authUser = require('../middleware/authUser')
//const authAdmin = require('../middleware/authAdmin')
const authMainAdmin = require('../middleware/authMainAdmin')
const router = new Router()
const fs = require('fs')

router.post('/categories', authUser, authMainAdmin, async (req, res) => {
    const category = new Category(req.body)
    try {
        await category.save()
        res.status(201).send(category)
        fs.appendFile(__dirname+"../../log.txt",`Action: POST, user: ${req.user.name}, Type: category, name: ${category.name} \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }

})

router.patch('/categories', authUser, authMainAdmin, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'isPublished']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const category = await Category.findOne({
            _id: req.query.id
        })

        if (!category)
            return res.status(404).send()
        updates.forEach((update) => { category[update] = req.body[update] })
        await category.save()
        res.status(200).send(category)
        fs.appendFile(__dirname+"../../log.txt",`Action: PATCH, user: ${req.user.name}, Type: category, name: ${category.name}  \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(400).send()
    }

})

// router.get('/categories/:id', async (req, res) => {
//     try {
//         const category = await Category.findOne({ _id: req.params.id, isPublished: true })
//         res.status(200).send(category)
//     } catch (error) {
//         res.status(500).send()
//     }
// })

router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find({ isPublished: true })
        res.status(200).send(categories)
        fs.appendFile(__dirname+"../../log.txt",`Action: GET  Type: categories isPublished: true \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})


router.get('/categories/:id', async (req, res) => {
    try {
        // console.log(req.params)
        const category = await Category.findOne({ _id: req.params.id })
        if (!category)
            res.sendStatus(404)
        res.status(200).send(category)
        fs.appendFile(__dirname+"../../log.txt",`Action: POST,  Type: category, name: ${category.name} \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})


router.get('/categoriesall', authUser, authMainAdmin, async (req, res) => {

    try {
        const categories = await Category.find({})
        res.status(200).send(categories)
        fs.appendFile(__dirname+"../../log.txt",`Action: GET, user: ${req.user.name}, Type: categoriesAll \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send()
    }
})

router.delete('/categories', authUser, authMainAdmin, async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.query.id })
        if (!category)
            return res.status(404).send()
        await category.remove()
        res.status(200).send(category)
        fs.appendFile(__dirname+"../../log.txt",`Action: DELETE, user: ${req.user.name}, Type: category, name: ${category.name} \n`,(err)=>{
            if(err)
                console.log(err)
        })
    }
    catch (error) {
        res.status(400).send(error);
    }
})



module.exports = router
