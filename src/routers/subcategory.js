const { Router } = require('express')
const Subcategory = require('../models/subcategory')
const authCategory = require('../middleware/authCategory')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const authMainAdmin = require('../middleware/authMainAdmin')
const router = new Router()

router.post('/subcategories',authUser, authAdmin, authMainAdmin, authCategory, async (req, res) => {
    const subcategory = new Subcategory({
        ...req.body,
        owner: req.category._id
    })

    try {
        const testSubcategory = await Subcategory.findOne({})
        if(testSubcategory && testSubcategory.type !== subcategory.type)
            return res.status(400).send(`Wrong type of subcategory, needs ${testSubcategory.type}`)
        
        if(!testSubcategory){
            req.category.subcategoriesType = subcategory.type
            await req.category.save()
        }

        await subcategory.save()
        res.status(201).send(subcategory)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/subcategories/:id', async (req,res)=>{
    try {
        const subcategory = await Subcategory.findOne({_id:req.params.id})
        if(!subcategory)
            res.status(404).send()
        
        res.status(200).send(subcategory)
    } catch (error) {
        res.status(500).send()
    }
})

// router.get('/subcategories', async (req,res)=>{
//     try {
//         const subcategories = await Subcategory.find({})
//         res.status(200).send(subcategories)
//     } catch (error) {
//         res.status(500).send()
//     }
// })

router.get('/subcategories', authCategory, async (req, res) => {
    try {
        await req.category.populate({
            path: 'subcategories'
        }).execPopulate()
        res.status(200).send(req.category.subcategories)
    }
    catch (error) {
        res.status(500).send()
    }
})


router.patch('/subcategories', authUser, authAdmin,authMainAdmin, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'subtitle','isPublished', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const subcategory = await Subcategory.findOne({
            _id: req.query.id
        })

        if (!subcategory)
            return res.status(404).send()

        updates.forEach((update) => subcategory[update] = req.body[update])
        await subcategory.save()

        
        res.status(200).send(subcategory)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router