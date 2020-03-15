const { Router } = require('express')
const Category = require('../models/category')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const router = new Router()


router.post('/categories', authUser, authAdmin, async (req, res) => {
    const category = new Category(req.body)
    try {
        await category.save()
        res.status(201).send(category)
    } catch (error) {
        res.status(400).send()
    }
})


router.patch('/categories/:id', authUser, authAdmin, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const category = await Category.findOne({
            _id: req.params.id
        })

        if (!category)
            return res.status(404).send()
        updates.forEach((update) => { category[update] = req.body[update] })
        await category.save()
        res.status(200).send(category)
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
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/categoriesall', authUser, authAdmin, async (req,res)=>{
    try {
        const categories = await Category.find({})
        res.status(200).send(categories)
    } catch (error) {
        res.status(500).send()   
    }
})


module.exports = router
