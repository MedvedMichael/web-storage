const { Router } = require('express')
const Subcategory = require('../models/subcategory')
const authCategory = require('../middleware/authCategory')

const router = new Router()

router.post('/subcategories', authCategory, async (req, res) => {
    const subcategory = new Subcategory({
        ...req.body,
        owner: req.category._id
    })
    try {
        await subcategory.save()
        res.status(201).send()
    } catch (error) {
        res.status(400).send()
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

module.exports = router