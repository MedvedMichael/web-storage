const { Router } = require('express')
const Subcategory = require('../models/subcategory')
const authCategory = require('../middleware/authCategory')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')
const authMainAdmin = require('../middleware/authMainAdmin')
const router = new Router()
const fs = require('fs')
router.post('/subcategories', authUser, authAdmin, authMainAdmin, authCategory, async (req, res) => {
    const subcategory = new Subcategory({
        ...req.body,
        owner: req.category._id
    })

    try {
        const testSubcategory = await Subcategory.findOne({})
        if (testSubcategory && testSubcategory.type !== subcategory.type)
            return res.status(400).send(`Wrong type of subcategory, needs ${testSubcategory.type}`)

        if (!testSubcategory) {
            req.category.subcategoriesType = subcategory.type
            await req.category.save()
        }

        await subcategory.save()
        res.status(201).send(subcategory)
        fs.appendFile(__dirname+"/../log.txt",`Action: POST,user:${req.user.name}  Type: subcategory,name:${subcategory.name} \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/subcategories/:id', async (req, res) => {
    try {
        const subcategory = await Subcategory.findOne({ _id: req.params.id })
        if (!subcategory)
            res.status(404).send()

        res.status(200).send(subcategory)
        fs.appendFile(__dirname+"/../log.txt",`Action: GET,  Type: subcategory,name:${subcategory.name} \n`,(err)=>{
            if(err)
                console.log(err)
        })
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
        fs.appendFile(__dirname+"/../log.txt",`Action: GET, Type: subcategories,categoryID:${req.category._id} \n`,(err)=>{
            if(err)
                console.log(err)
        })
    }
    catch (error) {
        res.status(500).send()
    }
})


router.patch('/subcategories', authUser, authMainAdmin, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'subtitle', 'isPublished', 'description']
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
        fs.appendFile(__dirname+"/../log.txt",`Action: PATCH,user:${req.user.name}, Type: subcategory,name:${subcategory.name} \n`,(err)=>{
            if(err)
                console.log(err)
        })
    } catch (error) {
        res.status(500).send(error)
    }
})


router.delete('/subcategories', authUser, authMainAdmin, async (req, res) => {
    try {
        const subcategory = await Subcategory.findOne({ _id: req.query.id })
        if (!subcategory)
            return res.status(404).send()
        await subcategory.remove()
        res.status(200).send(subcategory)
        fs.appendFile(__dirname+"/../log.txt",`Action: DELETE,user:${req.user.name}  Type: subcategory, name:${subcategory.name} \n`,(err)=>{
            if(err)
                console.log(err)
        })
    }
    catch (error) {
        res.status(400).send(error);
    }
})



module.exports = router